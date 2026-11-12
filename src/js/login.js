import { auth } from './firebase.js';
import { GoogleAuthProvider, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { accountFor, clearAccount, storeAccount } from './auth-roles.js';
const form=document.getElementById('loginForm');
const message=document.getElementById('loginMessage');
const passwordButton=form.querySelector('button[type=submit]');
const googleButton=document.getElementById('googleSignIn');
const resetForm=document.getElementById('resetForm');
const resetEmail=document.getElementById('resetEmail');
const resetMessage=document.getElementById('resetMessage');
function setBusy(busy){passwordButton.disabled=busy;googleButton.disabled=busy;resetForm.querySelector('button[type=submit]').disabled=busy}
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
  attempt(async()=>{
    await setPersistence(auth,document.getElementById('rememberMe').checked ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth,email,password);
  });
});
googleButton.addEventListener('click',()=>attempt(async()=>{
  await setPersistence(auth,document.getElementById('rememberMe').checked ? browserLocalPersistence : browserSessionPersistence);
  return signInWithPopup(auth,new GoogleAuthProvider());
}));
document.getElementById('forgotPassword').addEventListener('click',()=>{
  resetEmail.value=document.getElementById('email').value.trim();
  form.hidden=true;googleButton.hidden=true;resetForm.hidden=false;
  document.getElementById('loginTitle').textContent='Reset your password';
  document.querySelector('.login-subtitle').textContent='Enter your email address to receive a password reset link.';
  resetMessage.textContent='';resetEmail.focus();
});
document.getElementById('backToLogin').addEventListener('click',()=>{
  resetForm.hidden=true;form.hidden=false;googleButton.hidden=false;
  document.getElementById('loginTitle').textContent='Welcome Back';
  document.querySelector('.login-subtitle').textContent='Sign in to access Bee-to-Bee Operations.';
  document.getElementById('email').value=resetEmail.value.trim();
  message.textContent='';
});
resetForm.addEventListener('submit',async event=>{
  event.preventDefault();resetMessage.textContent='';setBusy(true);
  try{
    await sendPasswordResetEmail(auth,resetEmail.value.trim());
    resetMessage.textContent='If this email has a password sign-in account, a reset link will be sent. Check your inbox and spam folder.';
  }catch(error){
    console.error('Password reset failed',error);
    resetMessage.textContent={
      'auth/invalid-email':'Enter a valid email address.',
      'auth/too-many-requests':'Too many attempts. Please wait and try again.',
      'auth/network-request-failed':'Could not reach Firebase. Check your connection.'
    }[error.code] || 'Could not send the reset email. Please try again.';
  }finally{setBusy(false)}
});
onAuthStateChanged(auth,user=>{
  if(user){const account=accountFor(user);if(account)location.replace(account.page)}
});
