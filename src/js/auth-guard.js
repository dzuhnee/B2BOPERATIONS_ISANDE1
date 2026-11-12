import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { accountFor, clearAccount, storeAccount } from './auth-roles.js';
const expected=document.documentElement.dataset.role;
let checked=false;
onAuthStateChanged(auth,async user=>{
  if(checked && user) return;
  const account=accountFor(user);
  if(!account || account.role!==expected){
    checked=true;
    clearAccount();
    if(user && !account) await signOut(auth).catch(()=>{});
    location.replace('index.html');
    return;
  }
  checked=true;
  storeAccount(account);
  document.querySelector('#userName')?.replaceChildren(document.createTextNode(account.name));
  document.querySelector('#userRole')?.replaceChildren(document.createTextNode(account.role));
  document.querySelector('#userEmail')?.replaceChildren(document.createTextNode(account.email));
  document.documentElement.classList.remove('auth-pending');
});
document.addEventListener('click',async event=>{
  if(!event.target.closest('#logoutBtn,[data-account-action="signout"]'))return;
  event.preventDefault();event.stopImmediatePropagation();
  try{await signOut(auth)}finally{clearAccount();location.replace('index.html')}
},true);
