import { auth } from './firebase.js';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { accountFor, clearAccount, storeAccount } from './auth-roles.js';
const form=document.getElementById('loginForm');
const message=document.getElementById('loginMessage');
const passwordButton=form.querySelector('button[type=submit]');
const googleButton=document.getElementById('googleSignIn');
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
  attempt(()=>signInWithEmailAndPassword(auth,document.getElementById('email').value.trim().toLowerCase(),document.getElementById('password').value));
});
googleButton.addEventListener('click',()=>attempt(()=>signInWithPopup(auth,new GoogleAuthProvider())));
onAuthStateChanged(auth,user=>{
  if(user){const account=accountFor(user);if(account)location.replace(account.page)}
});
