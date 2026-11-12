import { auth } from './firebase.js';
import { GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { ACCOUNTS, accountFor, clearAccount, storeAccount } from './auth-roles.js';
const form=document.getElementById('loginForm');
const message=document.getElementById('loginMessage');
const passwordButton=form.querySelector('button[type=submit]');
const googleButton=document.getElementById('googleSignIn');
function setBusy(busy){passwordButton.disabled=busy;googleButton.disabled=busy}
async function complete(user){
  const account=accountFor(user);
  if(!account){
    const known=Boolean(ACCOUNTS[user.email?.toLowerCase()]);
    if(known && !user.emailVerified){
      await sendEmailVerification(user);
      await signOut(auth);
      throw new Error('Verify your email using the link we sent, then sign in again.');
    }
    await signOut(auth);clearAccount();
    throw new Error('No dashboard is assigned to this verified account.');
  }
  storeAccount(account);
  location.assign(account.page);
}
async function attempt(action){
  message.textContent='';setBusy(true);
  try{await complete((await action()).user)}
  catch(error){
    console.error('Sign-in failed',error);
    message.textContent=error.message?.startsWith('Verify your email') || error.message?.startsWith('No dashboard')
      ? error.message : 'Sign-in failed. Check your credentials or try again.';
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
