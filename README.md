# B2BOPERATIONS_ISANDE1
## Authentication and role access

Dashboard access uses Firebase Authentication. The email form accepts only the fixed account/password pairs in `src/js/login.js`, then signs in to Firebase for a session. Google sign-in is separate. The Firebase email must match the account's role in `src/js/auth-roles.js`. Dashboard pages recheck the Firebase session on load. `firestore.rules` enforces role-specific data access; local browser storage only holds display information. The fixed passwords are visible in frontend source and must be treated as demo credentials.

Before using Google sign-in, enable the Google provider in Firebase Authentication and add the site's domain to Authorized domains. Enable Email/Password for password sign-in. Publish the updated Firestore rules for server-side role checks to take effect. Keep the allowed email list in `auth-roles.js`, `role-backend.js`, and `firestore.rules` in sync when assigning accounts.
