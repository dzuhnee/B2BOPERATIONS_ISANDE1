// Dashboard routing is a UI convenience. Firestore rules enforce data access.
export const ACCOUNTS = Object.freeze({
  'sophia.ramirez@5joys.com': {name:'Sophia Ramirez',role:'Business Development',page:'business-development.html'},
  'carlos.reyes@5joys.com': {name:'Carlos Reyes',role:'Operations Head',page:'operations-head.html'},
  'angela.santos@5joys.com': {name:'Angela Santos',role:'HR Specialist',page:'hr-specialist.html'},
  'michael.dela.cruz@5joys.com': {name:'Michael Dela Cruz',role:'Store Trainer',page:'store-trainer.html'},
  'ruth.reyes@5joys.com': {name:'Ruth Reyes',role:'Store Manager',page:'store-manager.html'},
  'ruth.torres@5joys.com': {name:'Ruth Torres',role:'Store Manager',page:'store-manager.html'},
  'joel.navarro@5joys.com': {name:'Joel Navarro',role:'Supply Chain Officer',page:'supply-chain.html'},
  'bea.hernandez@5joys.com': {name:'Bea Hernandez',role:'Area Manager',page:'area-manager.html'},
  'engr.nina.cruz@5joys.com': {name:'Engr. Nina Cruz',role:'Engineering Head',page:'engineering-head.html'},
  'maria.santos@5joys.com': {name:'Maria Santos',role:'Executive Management',page:'executive-management.html'},
  'carlo.lim@5joys.com': {name:'Carlo Lim',role:'Finance Head',page:'finance-head.html'},
  'atty.maya.santos@5joys.com': {name:'Atty. Maya Santos',role:'Legal Head',page:'legal-head.html'}
});
export const accountFor = user => {
  const email=user?.email?.toLowerCase();
  return user && ACCOUNTS[email] ? {...ACCOUNTS[email],email} : null;
};
export function storeAccount(account){
  localStorage.setItem('loggedInUser',JSON.stringify({email:account.email,name:account.name,role:account.role}));
  localStorage.setItem('b2bUserRole',account.role);
  localStorage.setItem('b2bUserName',account.name);
  const department=account.role.replace(/ Head$/,'');
  if(department!==account.role)localStorage.setItem('b2bDepartment',department);
  else localStorage.removeItem('b2bDepartment');
}
export function clearAccount(){
  ['loggedInUser','b2bUserRole','b2bUserName','b2bDepartment'].forEach(key=>localStorage.removeItem(key));
}
