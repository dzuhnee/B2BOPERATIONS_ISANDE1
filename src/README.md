# Bee-to-Bee Multi-Role Dashboard

Open `index.html` in a browser.

Connected roles:
- Area Manager → `area-manager.html`
- Supply Chain Officer → `supply-chain.html`
- Operations Head → `operations-head.html` + `js/operations-head.js`
- Legal Head → `legal-head.html` + `js/legal-head.js`
- Finance Head → `finance-head.html` + `js/finance-head.js`
- Engineering Head → `engineering-head.html` + `js/engineering-head.js`
- HR Specialist → `hr-specialist.html`

The four department-head pages use `js/department-head-dashboard.js` for shared
proposal filtering, modal, and approval functions. Their profiles, requirements,
and sample proposal records remain in `js/department-head-data.js`. The older
`department-head.html` entry point is retained only for compatibility with saved
links; new login sessions route to the separate role pages.

The Supply Chain Officer dashboard includes Supply Readiness, Deliveries, Receiving, Inventory, Supplier Issues, Launch Confirmation, and Settings. Buttons use front-end demo interactions and local page state only; connect them to your backend/API for permanent database updates.
