import { auth } from './firebase.js';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { accountFor, clearAccount, storeAccount } from './auth-roles.js';
const form=document.getElementById('loginForm');
const message=document.getElementById('loginMessage');
const passwordButton=form.querySelector('button[type=submit]');
const googleButton=document.getElementById('googleSignIn');
// Fixed password credentials for the assigned demo accounts. This check is
// followed by Firebase sign-in so Firestore can authorize dashboard requests.
const PASSWORDS=Object.freeze({
  'sophia.ramirez@5joys.com':'Sophia@B2B2026',
  'carlos.reyes@5joys.com':'Carlos@B2B2026',
  'angela.santos@5joys.com':'Angela@B2B2026',
  'michael.dela.cruz@5joys.com':'Michael@B2B2026',
  'ruth.reyes@5joys.com':'RuthR@B2B2026',
  'joel.navarro@5joys.com':'Joel@B2B2026',
  'bea.hernandez@5joys.com':'Bea@B2B2026',
  'ruth.torres@5joys.com':'RuthT@B2B2026',
  'engr.nina.cruz@5joys.com':'Nina@B2B2026',
  'maria.santos@5joys.com':'Maria@B2B2026',
  'carlo.lim@5joys.com':'Carlo@B2B2026',
  'atty.maya.santos@5joys.com':'Maya@B2B2026'
});
function setBusy(busy){passwordButton.disabled=busy;googleButton.disabled=busy}
async function complete(user){
  const account=accountFor(user);
  if(!account){
    await signOut(auth);clearAccount();
    throw new Error('No dashboard is assigned to this account.');
  }
  storeAccount(account);
  location.assign(account.page);
}
async function attempt(action){
  message.textContent='';setBusy(true);
  try{await complete((await action()).user)}
  catch(error){
    console.error('Sign-in failed',error);
    const reasons={
      'auth/invalid-credential':'Email or password is incorrect.',
      'auth/user-disabled':'This account is disabled.',
      'auth/too-many-requests':'Too many attempts. Please wait and try again.',
      'auth/network-request-failed':'Could not reach Firebase. Check your connection.',
      'auth/operation-not-allowed':'This sign-in method is not enabled in Firebase.',
      'auth/unauthorized-domain':'This site is not authorized for Google sign-in.',
      'auth/popup-blocked':'Allow popups for this site to sign in with Google.',
      'auth/popup-closed-by-user':'Google sign-in was cancelled.'
    };
    message.textContent=error.message?.startsWith('No dashboard') ? error.message
      : reasons[error.code] || 'Sign-in failed. Please try again.';
  }finally{setBusy(false)}
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const email=document.getElementById('email').value.trim().toLowerCase();
  const password=document.getElementById('password').value;
  if(PASSWORDS[email]!==password){
    message.textContent='Email or password is incorrect.';
    return;
  }
  attempt(()=>signInWithEmailAndPassword(auth,email,password));
});
googleButton.addEventListener('click',()=>attempt(()=>signInWithPopup(auth,new GoogleAuthProvider())));
onAuthStateChanged(auth,user=>{
  if(user){const account=accountFor(user);if(account)location.replace(account.page)}
});
