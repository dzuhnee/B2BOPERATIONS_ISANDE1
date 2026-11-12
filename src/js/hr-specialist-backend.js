import { db } from './firebase.js';
import { collection, doc, getDocs, onSnapshot, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { requireRole, describeError, loadSettings, saveSettings, readSettingsForm, applySettingsForm } from './role-backend.js';
const data=window.hrSpecialistData;
let session, ready=false, settings;
const notify=()=>window.dispatchEvent(new Event('hr-data-changed'));
async function init(){
  session=await requireRole('HR Specialist');
  const [applicants,batches]=await Promise.all([getDocs(collection(db,'hrApplicants')),getDocs(collection(db,'hrBatches'))]);
  // Seed the bundled demonstration register only when the persistent collection is empty.
  if(applicants.empty || batches.empty){
    const batch=writeBatch(db);
    if(applicants.empty)data.applicants.forEach(a=>batch.set(doc(db,'hrApplicants',a.id),{...a,updatedBy:session.email}));
    if(batches.empty)data.batches.forEach(b=>batch.set(doc(db,'hrBatches',b.id),{...b,updatedBy:session.email}));
    await batch.commit();
  }
  onSnapshot(collection(db,'hrApplicants'),snapshot=>{data.applicants=snapshot.docs.map(d=>({...d.data(),id:d.id}));notify()},error=>window.B2B.toast(describeError(error,'load applicants')));
  onSnapshot(collection(db,'hrBatches'),snapshot=>{data.batches=snapshot.docs.map(d=>({...d.data(),id:d.id}));notify()},error=>window.B2B.toast(describeError(error,'load training batches')));
  settings=await loadSettings(session).catch(()=>null);
  ready=true;notify();
}
window.hrBackend={
  get ready(){return ready},
  async commit(before){
    if(!ready)throw new Error('Still connecting to Firebase. Try again in a moment.');
    for(const applicant of data.applicants){
      if(applicant.deployed && applicant.certification!=='Certified')throw new Error('Only certified employees can be released.');
      if(!['New Applicant','For Screening','Shortlisted','Interview Scheduled','Interview Completed','For Further Review','Hired','Rejected','Assigned to Training'].includes(applicant.status))throw new Error('Invalid applicant status.');
    }
    for(const training of data.batches){
      if(!Number.isInteger(training.capacity)||!Number.isInteger(training.assigned)||training.capacity<1||training.assigned<0||training.assigned>training.capacity)throw new Error('Training capacity or assignment count is invalid.');
    }
    const batch=writeBatch(db);
    for(const [name,records,previous] of [['hrApplicants',data.applicants,before.applicants],['hrBatches',data.batches,before.batches]]){
      const old=new Map(previous.map(r=>[r.id,JSON.stringify(r)]));
      records.filter(r=>JSON.stringify(r)!==old.get(r.id)).forEach(record=>batch.set(doc(db,name,record.id),{...record,updatedAt:serverTimestamp(),updatedBy:session.email}));
    }
    await batch.commit();
  },
  async saveSettings(){
    const value=readSettingsForm(document.getElementById('pageContent'));
    await saveSettings(session,value);settings=value;
  },
  applySettings(root){applySettingsForm(root,settings)},
  describeError
};
init().catch(error=>{console.error(error);window.B2B?.toast(describeError(error,'load HR records'))});
