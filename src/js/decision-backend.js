import { db } from './firebase.js';
import { collection, doc, getDoc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { ValidationError, applySettingsForm, describeError, loadSettings, oneOf, optionalText, readSettingsForm, requireRole, requiredText, saveSettings } from './role-backend.js';

const {config, controller} = window.departmentRole;
const department = config.department;
const key = department.toLowerCase();
const reviews = `${key}Reviews`;
const original = new Map(window.departmentHeadData.proposals.map(p => [p.id, {status:p.status, history:structuredClone(p.history)}]));
let session, settings;
const choices = ['Satisfied', 'Needs Clarification', 'Incomplete', 'Not Applicable'];

async function saveDecision({proposal, department:source, requirements, status, remarks, checklist}) {
  if (!session) throw new ValidationError('Still connecting to Firebase. Try again in a moment.');
  if (source !== department || !proposal?.id) throw new ValidationError('Invalid proposal decision.');
  oneOf(status, ['Approved','Revision Requested','Rejected'], 'Decision');
  const note = status === 'Approved' ? optionalText(remarks,'Remarks',1000) || 'Approved with no additional remarks.' : requiredText(remarks,'Remarks',1000);
  const checked = {};
  requirements.forEach(item => { checked[item] = oneOf(checklist?.[item],choices,`${item} status`); });
  if (status === 'Approved' && Object.values(checked).some(value => value === 'Incomplete' || value === 'Needs Clarification')) throw new ValidationError('Resolve all incomplete or unclear requirements before approval.');
  const ref = doc(db,reviews,proposal.id);
  const entry = {reviewer:session.name, status, remarks:note, decidedAt:new Date().toISOString(), decidedBy:session.email};
  await runTransaction(db,async tx => {
    const current = await tx.get(ref);
    tx.set(ref,{proposalId:proposal.id,site:proposal.site,status,remarks:note,checklist:checked,history:[...(current.data()?.history || []),entry],updatedAt:serverTimestamp(),updatedBy:session.email});
  });
  try {
    const appRef = doc(db,'siteApplications',proposal.id);
    const app = await getDoc(appRef);
    if (app.exists() && (app.data().location === proposal.site || app.data().municipality === proposal.location)) {
      await updateDoc(appRef,{[`workflowStatus.${key}`]:status,[`${key}UpdatedAt`]:serverTimestamp(),[`${key}UpdatedBy`]:session.email});
    }
  } catch(error) {
    console.error('Decision saved but site application sync failed',error);
    return {message:`${department} decision saved; site application update failed. ${describeError(error,'update the site application')}`};
  }
  return {message:`${department} decision saved.`};
}

async function saveSettingsSection(button) {
  if (!session) return window.B2B.toast('Still connecting to Firebase.');
  button.disabled = true;
  try { settings = readSettingsForm(document.getElementById('pageContent')); await saveSettings(session,settings); window.B2B.toast('Settings saved.'); }
  catch(error) { window.B2B.toast(describeError(error,'save settings')); }
  finally { button.disabled = false; }
}

async function init() {
  session = await requireRole(`${department} Head`);
  config.backend = {saveDecision,describeError:error=>describeError(error,'save this decision'),saveSettings:saveSettingsSection,afterRender:(section,root)=>{if(section==='settings')applySettingsForm(root,settings)}};
  loadSettings(session).then(value=>{settings=value}).catch(error=>window.B2B.toast(describeError(error,'load settings')));
  onSnapshot(collection(db,reviews),snapshot=>{
    const saved = new Map(snapshot.docs.map(item=>[item.id,item.data()]));
    window.departmentHeadData.proposals.forEach(proposal=>{
      const review=saved.get(proposal.id), base=original.get(proposal.id);
      if (!review) return;
      proposal.status=review.status;
      proposal.checklists={[department]:review.checklist};
      proposal.history=[...(base?.history || proposal.history || []),...(review.history || []).map(item=>[department,item.reviewer,item.status,item.remarks,new Date(item.decidedAt).toLocaleString()])];
    });
    controller.refresh();
  },error=>window.B2B.toast(describeError(error,'load saved decisions')));
}
init().catch(error=>{console.error(error);window.B2B.toast(describeError(error,'connect to Firebase'))});
