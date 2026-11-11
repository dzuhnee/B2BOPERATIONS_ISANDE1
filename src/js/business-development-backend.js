/* ==========================================================
   BEE-TO-BEE OPERATIONS
   BUSINESS DEVELOPMENT — FIRESTORE BACKEND

   Firestore layout:
   - siteApplications/{siteId}      one document per site application
   - siteArchives/{siteId}          archive metadata (reason, archivedDate, ...)
   - businessDevelopment/dashboard  stats, alerts, aiInsights,
                                    recommendations, locationDatabase

   On load this module replaces the contents of
   window.businessDevelopmentData with what is stored in Firestore,
   so the existing rendering code keeps working unchanged.

   The first time it runs against an empty database it seeds
   Firestore from js/business-development-data.js.
========================================================== */

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    runTransaction,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const APPLICATIONS = "siteApplications";
const ARCHIVES = "siteArchives";
const dashboardRef = doc(db, "businessDevelopment", "dashboard");

const localData = window.businessDevelopmentData;
// Snapshot of the bundled demo data, used only to seed an empty database.
const seedData = localData ? structuredClone(localData) : null;

function waitForSignedInUser(){
    return new Promise(resolve=>{
        const unsubscribe = onAuthStateChanged(auth, user=>{
            unsubscribe();
            resolve(user);
        });
    });
}

async function seedFirestore(){
    if(!seedData) throw new Error("No local seed data available.");

    const { applications = [], archives = [], user, ...dashboard } = seedData;
    const batch = writeBatch(db);

    applications.forEach((application, index)=>{
        batch.set(doc(db, APPLICATIONS, application.id), { ...application, order:index });
    });
    archives.forEach(archive=>{
        batch.set(doc(db, ARCHIVES, archive.id), archive);
    });
    batch.set(dashboardRef, { ...dashboard, seededAt:serverTimestamp() });

    await batch.commit();
    console.info(`Seeded Firestore with ${applications.length} applications and ${archives.length} archives.`);
}

async function loadBusinessDevelopmentData(){
    const user = await waitForSignedInUser();

    if(!user){
        // The Firebase session is gone, so Firestore would reject reads.
        localStorage.removeItem("loggedInUser");
        location.href = "index.html";
        return new Promise(()=>{}); // stop the dashboard from rendering
    }

    let dashboardSnap = await getDoc(dashboardRef);
    if(!dashboardSnap.exists()){
        await seedFirestore();
        dashboardSnap = await getDoc(dashboardRef);
    }

    const [applicationSnap, archiveSnap] = await Promise.all([
        getDocs(collection(db, APPLICATIONS)),
        getDocs(collection(db, ARCHIVES))
    ]);

    const applications = applicationSnap.docs
        .map(d=>({ id:d.id, ...d.data() }))
        .sort((a,b)=>(a.order ?? 0) - (b.order ?? 0));
    const archives = archiveSnap.docs.map(d=>({ id:d.id, ...d.data() }));

    const { seededAt, ...dashboard } = dashboardSnap.data();
    Object.assign(localData, dashboard, { applications, archives });

    return localData;
}

/**
 * Save a new site proposal. Overwrites an existing application with the same id
 * and only bumps the dashboard counters when the id is new.
 */
async function saveSiteProposal(application){
    const ref = doc(db, APPLICATIONS, application.id);

    return runTransaction(db, async transaction=>{
        const existing = await transaction.get(ref);

        transaction.set(ref, {
            ...application,
            order:-Date.now(), // newest first
            createdAt:serverTimestamp(),
            createdBy:auth.currentUser?.uid || null
        });

        if(!existing.exists()){
            transaction.update(dashboardRef, {
                "stats.totalApplications":increment(1),
                "stats.pendingAnalysis":increment(1)
            });
        }

        return { isNew:!existing.exists() };
    });
}

window.bdBackend = {
    ready:loadBusinessDevelopmentData(),
    saveSiteProposal
};
