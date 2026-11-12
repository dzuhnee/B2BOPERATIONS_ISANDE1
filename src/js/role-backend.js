/* ==========================================================
   BEE-TO-BEE OPERATIONS
   SHARED FIRESTORE HELPERS — Area Manager, Supply Chain Officer,
   and Legal Head dashboards (IG2S5-42)

   - requireRole()        confirms the Firebase session belongs to the
                          dashboard's role before any read or write
   - watchCollection()    live listener; seeds an empty collection once
                          from the dashboard's bundled demo records
   - saveRecord()         merge-write stamped with updatedAt / updatedBy
   - createWithSequence() transactional, collision-free record IDs
   - logActivity()        append-only activity feed entries
   - settings helpers     per-user settings in userSettings/{uid}

   Server-side enforcement of the same role rules lives in
   firestore.rules at the repository root.
========================================================== */

import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    runTransaction,
    serverTimestamp,
    setDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/** Accounts allowed to use each dashboard. Mirror any change in firestore.rules. */
export const ROLE_ACCOUNTS = {
    "Area Manager": ["bea.hernandez@5joys.com"],
    "Supply Chain Officer": ["joel.navarro@5joys.com"],
    "Legal Head": ["atty.maya.santos@5joys.com"],
    "Operations Head": ["carlos.reyes@5joys.com"],
    "Finance Head": ["carlo.lim@5joys.com"],
    "HR Specialist": ["angela.santos@5joys.com"]
};

const SESSION_KEYS = ["loggedInUser", "b2bUserRole", "b2bUserName", "b2bDepartment"];

/** Raised for input problems the user can fix; its message is shown as-is. */
export class ValidationError extends Error {}

function clearSession(){
    SESSION_KEYS.forEach(key=>localStorage.removeItem(key));
}

function waitForUser(){
    return new Promise(resolve=>{
        const unsubscribe = onAuthStateChanged(auth, user=>{
            unsubscribe();
            resolve(user);
        });
    });
}

let signOutBound = false;
/** Makes Log Out / Sign out end the Firebase session, not just clear localStorage. */
function bindSignOut(){
    if(signOutBound) return;
    signOutBound = true;
    // Capture phase runs before the page's own logout handlers, which
    // navigate away synchronously and would cut signOut() short.
    document.addEventListener("click", async event=>{
        const trigger = event.target.closest('#logoutBtn, [data-account-action="signout"]');
        if(!trigger) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        try{
            await signOut(auth);
        }catch(error){
            console.error("Firebase sign-out failed:", error);
        }
        clearSession();
        location.href = "index.html";
    }, true);
}

/**
 * Resolves with the signed-in user when their Firebase account belongs to `role`.
 * Otherwise signs out, returns to the login page, and never resolves.
 */
export async function requireRole(role){
    const user = await waitForUser();
    const email = user?.email?.toLowerCase() || "";
    const allowed = Boolean(user?.emailVerified) && (ROLE_ACCOUNTS[role] || []).includes(email);

    if(!allowed){
        if(user) await signOut(auth).catch(()=>{});
        clearSession();
        alert(user
            ? `This account is not authorized to use the ${role} dashboard.`
            : "Your session has expired. Please sign in again.");
        location.replace("index.html");
        return new Promise(()=>{});
    }

    bindSignOut();
    let storedName = "";
    try{ storedName = JSON.parse(localStorage.getItem("loggedInUser") || "{}").name || ""; }catch{ /* ignore */ }
    return { uid:user.uid, email, role, name:storedName || user.displayName || email };
}

/** Turns a Firestore/Auth error into a message a dashboard user can act on. */
export function describeError(error, action = "save this change"){
    if(error instanceof ValidationError) return error.message;
    const code = String(error?.code || "");
    if(code.includes("permission-denied")) return `Firebase denied permission to ${action} for this role.`;
    if(code.includes("unauthenticated")) return `Your session expired. Sign in again to ${action}.`;
    if(code.includes("unavailable") || code.includes("deadline-exceeded")) return `Could not ${action}: Firebase is unreachable. Check the connection and try again.`;
    return `Could not ${action}. Please try again.`;
}

const byOrder = (left, right)=>(left.order ?? 0) - (right.order ?? 0);

async function seedCollection(name, records){
    const batch = writeBatch(db);
    records.forEach((record, index)=>{
        batch.set(doc(db, name, record.id), { ...record, order:index, seededAt:serverTimestamp() });
    });
    await batch.commit();
    console.info(`Seeded ${name} with ${records.length} records.`);
}

/**
 * Live-subscribes to a collection. The first time it is empty, it is seeded
 * from `seedRecords` (each needs an `id`). `onData` receives records sorted by
 * `order` (seeded records first in their original order, new records on top).
 */
export function watchCollection(name, seedRecords, onData, onError){
    let seedAttempted = false;
    return onSnapshot(collection(db, name), async snapshot=>{
        if(snapshot.empty && seedRecords?.length && !seedAttempted){
            seedAttempted = true;
            try{
                await seedCollection(name, seedRecords);
            }catch(error){
                onError(error);
            }
            return; // the seeded documents arrive in the next snapshot
        }
        const records = snapshot.docs
            .map(item=>({ ...item.data({ serverTimestamps:"estimate" }), id:item.id }))
            .sort(byOrder);
        onData(records);
    }, onError);
}

function audit(user){
    return { updatedAt:serverTimestamp(), updatedBy:user.email };
}

/** Merge-writes `data` into name/id with audit fields. */
export function saveRecord(name, id, data, user){
    return setDoc(doc(db, name, id), { ...data, ...audit(user) }, { merge:true });
}

/**
 * Creates a record whose ID comes from counters/{counter}, inside one
 * transaction so two users can never receive the same ID.
 * `start` is the lowest number to use (e.g. highest seeded number + 1).
 */
export function createWithSequence(name, { counter, start, format }, data, user){
    return runTransaction(db, async transaction=>{
        const counterRef = doc(db, "counters", counter);
        const counterSnap = await transaction.get(counterRef);
        const stored = counterSnap.exists() ? Number(counterSnap.data().value) + 1 : 0;
        const next = Math.max(Number.isFinite(stored) ? stored : 0, start);
        const id = format(next);

        transaction.set(counterRef, { value:next, ...audit(user) });
        transaction.set(doc(db, name, id), {
            ...data,
            id,
            order:-Date.now(),
            createdAt:serverTimestamp(),
            createdBy:user.email,
            ...audit(user)
        });
        return id;
    });
}

/** Appends an activity entry to `name` (newest first by `order`). */
export function logActivity(name, user, entry){
    return setDoc(doc(collection(db, name)), {
        ...entry,
        order:-Date.now(),
        createdAt:serverTimestamp(),
        createdBy:user.email
    });
}

/** Highest numeric suffix among ids matching `pattern` (one capture group). */
export function highestNumber(records, pattern){
    return records.reduce((highest, record)=>{
        const match = String(record.id).match(pattern);
        return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);
}

/* ---------- Validation helpers ---------- */

export function requiredText(value, label, max = 500){
    const text = String(value ?? "").trim();
    if(!text) throw new ValidationError(`${label} is required.`);
    if(text.length > max) throw new ValidationError(`${label} must be ${max} characters or fewer.`);
    return text;
}

export function optionalText(value, label, max = 1000){
    const text = String(value ?? "").trim();
    if(text.length > max) throw new ValidationError(`${label} must be ${max} characters or fewer.`);
    return text;
}

export function oneOf(value, allowed, label){
    if(!allowed.includes(value)) throw new ValidationError(`${label} must be one of: ${allowed.join(", ")}.`);
    return value;
}

export function wholeNumber(value, label, min, max){
    const number = Number(value);
    if(String(value).trim() === "" || !Number.isInteger(number) || number < min || number > max){
        throw new ValidationError(`${label} must be a whole number from ${min} to ${max}.`);
    }
    return number;
}

export function isoDate(value, label, { required = true } = {}){
    const text = String(value ?? "").trim();
    if(!text){
        if(required) throw new ValidationError(`${label} is required.`);
        return "";
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(new Date(`${text}T00:00:00`).getTime())){
        throw new ValidationError(`${label} must be a valid date.`);
    }
    return text;
}

/* ---------- Per-user settings (Settings section) ---------- */

/** Reads every editable control inside `.settings-form` blocks under `root`. */
export function readSettingsForm(root){
    const fields = {};
    const toggles = {};
    root.querySelectorAll(".settings-form input, .settings-form textarea").forEach(input=>{
        if(input.disabled) return;
        if(input.type === "checkbox"){
            const key = input.closest("label")?.textContent.trim();
            if(key) toggles[key] = input.checked;
            return;
        }
        const label = input.previousElementSibling?.tagName === "LABEL"
            ? input.previousElementSibling.textContent.trim()
            : "";
        if(label) fields[label] = input.value.trim();
    });

    Object.entries(fields).forEach(([label, value])=>{
        if(/name/i.test(label)) requiredText(value, label, 80);
        if(/email/i.test(label) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
            throw new ValidationError(`${label} must be a valid email address.`);
        }
    });
    return { fields, toggles };
}

/** Restores saved values into a freshly rendered settings section. */
export function applySettingsForm(root, settings){
    if(!settings) return;
    root.querySelectorAll(".settings-form input, .settings-form textarea").forEach(input=>{
        if(input.disabled) return;
        if(input.type === "checkbox"){
            const key = input.closest("label")?.textContent.trim();
            if(key && key in (settings.toggles || {})) input.checked = Boolean(settings.toggles[key]);
            return;
        }
        const label = input.previousElementSibling?.tagName === "LABEL"
            ? input.previousElementSibling.textContent.trim()
            : "";
        if(label && label in (settings.fields || {})) input.value = settings.fields[label];
    });
}

export async function loadSettings(user){
    const snapshot = await getDoc(doc(db, "userSettings", user.uid));
    return snapshot.exists() ? snapshot.data() : null;
}

export function saveSettings(user, settings){
    return setDoc(doc(db, "userSettings", user.uid), {
        ...settings,
        role:user.role,
        email:user.email,
        ...audit(user)
    });
}

/** Formats a Firestore Timestamp (or fallback text) for activity lists. */
export function formatWhen(value, fallback = "Just now"){
    const date = value?.toDate ? value.toDate() : null;
    if(!date) return fallback;
    return new Intl.DateTimeFormat("en-US", {
        month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit"
    }).format(date);
}
