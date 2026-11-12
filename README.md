# B2BOPERATIONS_ISANDE1
## Authentication and role access

Dashboard access uses Firebase Authentication. The email form accepts Firebase email/password accounts, and Google sign-in uses the Google provider. Forgot password sends a Firebase password reset email to the address entered; Google-only accounts should sign in with Google unless an email/password sign-in method is linked. The Firebase email must match an assigned account in `src/js/auth-roles.js` to open a dashboard. Dashboard pages recheck the Firebase session on load. `firestore.rules` enforces role-specific data access; local browser storage only holds display information. The Remember me option selects local persistence; otherwise the Firebase session lasts for the browser session.

Before using Google sign-in, enable the Google provider in Firebase Authentication and add the site's domain to Authorized domains. Enable Email/Password for password sign-in. Publish the updated Firestore rules for server-side role checks to take effect. Keep the allowed email list in `auth-roles.js`, `role-backend.js`, and `firestore.rules` in sync when assigning accounts.
