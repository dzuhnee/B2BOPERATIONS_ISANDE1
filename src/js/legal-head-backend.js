/* ==========================================================
   BEE-TO-BEE OPERATIONS
   LEGAL HEAD — FIRESTORE BACKEND (IG2S5-42)

   Firestore layout:
   - legalReviews/{proposalId}   current Legal decision, requirement
                                 checklist, and the Legal decision history
   - siteApplications/{id}       workflowStatus.legal is updated when the
                                 proposal matches a Business Development
                                 application (shown on Executive Management)
   - userSettings/{uid}          Settings section values

   js/legal-head.js renders the shared department-head dashboard from the
   bundled proposals; this module overlays the persisted Legal state on top
   and re-renders whenever it changes.
========================================================== */

import { db } from "./firebase.js";
import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    ValidationError,
    applySettingsForm,
    describeError,
    loadSettings,
    oneOf,
    optionalText,
    readSettingsForm,
    requireRole,
    requiredText,
    saveSettings,
    watchCollection
} from "./role-backend.js";

const REVIEWS = "legalReviews";
const DECISIONS = ["Approved", "Revision Requested", "Rejected"];
const CHECKLIST_OPTIONS = ["Satisfied", "Needs Clarification", "Incomplete", "Not Applicable"];

const legalHead = window.legalHead;
const proposals = window.departmentHeadData.proposals;
// Bundled state of every proposal, restored when it has no saved Legal review.
const seedState = new Map(proposals.map(proposal=>[proposal.id, {
    status:proposal.status,
    history:structuredClone(proposal.history)
}]));

let session = null;
let savedSettings = null;

function formatDecisionTime(iso){
    const date = new Date(iso);
    if(Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
        month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit"
    }).format(date);
}

/** Overlays saved Legal reviews onto the in-memory proposals. */
function applyReviews(reviews){
    const byId = new Map(reviews.map(review=>[review.id, review]));
    proposals.forEach(proposal=>{
        const seed = seedState.get(proposal.id) || {
            status:proposal.status || "Pending Review",
            history:proposal.history || []
        };
        const review = byId.get(proposal.id);
        proposal.status = review?.status || seed.status;
        proposal.checklists = review?.checklist ? { Legal:review.checklist } : {};
        proposal.history = [
            ...structuredClone(seed.history),
            ...(review?.history || []).map(entry=>[
                "Legal",
                entry.reviewer,
                entry.status,
                entry.remarks,
                formatDecisionTime(entry.decidedAt)
            ])
        ];
    });
    legalHead.controller.refresh();
}

function validateDecision({ proposal, department, requirements, status, remarks, checklist }){
    if(department !== "Legal") throw new ValidationError("Only Legal decisions can be saved from this dashboard.");
    if(!proposals.some(item=>item.id === proposal?.id)) throw new ValidationError("This proposal no longer exists.");
    oneOf(status, DECISIONS, "Decision");
    const cleanRemarks = status === "Approved"
        ? optionalText(remarks, "Remarks") || "Approved with no additional remarks."
        : requiredText(remarks, "Remarks", 1000);

    const cleanChecklist = {};
    requirements.forEach(requirement=>{
        cleanChecklist[requirement] = oneOf(checklist?.[requirement], CHECKLIST_OPTIONS, `${requirement} status`);
    });
    if(status === "Approved"){
        const open = requirements.filter(requirement=>["Incomplete", "Needs Clarification"].includes(cleanChecklist[requirement]));
        if(open.length){
            throw new ValidationError(`Resolve these requirements before approving: ${open.join(", ")}.`);
        }
    }
    return { remarks:cleanRemarks, checklist:cleanChecklist };
}

/** Mirrors the decision onto the matching Business Development application. */
async function syncSiteApplication(proposal, status){
    const ref = doc(db, "siteApplications", proposal.id);
    const snapshot = await getDoc(ref);
    if(!snapshot.exists()) return false;
    const application = snapshot.data();
    // Bundled IDs overlap between data sets, so also require the same site.
    const sameSite = application.location === proposal.site || application.municipality === proposal.location;
    if(!sameSite) return false;
    await updateDoc(ref, {
        "workflowStatus.legal":status,
        legalUpdatedAt:serverTimestamp(),
        legalUpdatedBy:session.email
    });
    return true;
}

async function saveDecision(decision){
    if(!session) throw new ValidationError("Still connecting to Firebase. Try again in a moment.");
    const { proposal, status } = decision;
    const { remarks, checklist } = validateDecision(decision);
    const entry = {
        reviewer:session.name,
        status,
        remarks,
        decidedAt:new Date().toISOString(),
        decidedBy:session.email
    };

    await runTransaction(db, async transaction=>{
        const ref = doc(db, REVIEWS, proposal.id);
        const existing = await transaction.get(ref);
        const history = existing.exists() ? existing.data().history || [] : [];
        transaction.set(ref, {
            proposalId:proposal.id,
            site:proposal.site,
            location:proposal.location,
            status,
            remarks,
            checklist,
            history:[...history, entry],
            updatedAt:serverTimestamp(),
            updatedBy:session.email
        });
    });

    try{
        const synced = await syncSiteApplication(proposal, status);
        return {
            message:synced
                ? `Legal decision saved: ${proposal.site} is ${status.toLowerCase()}. Executive Management is updated.`
                : `Legal decision saved: ${proposal.site} is ${status.toLowerCase()}.`
        };
    }catch(error){
        console.error("Legal decision saved, but the site application was not updated:", error);
        return { message:`Legal decision saved, but the site application status could not be updated (${describeError(error, "update it")}).` };
    }
}

async function saveSettingsSection(button){
    if(!session){
        window.B2B.toast("Still connecting to Firebase. Try again in a moment.");
        return;
    }
    const label = button.textContent;
    button.disabled = true;
    button.textContent = "Saving…";
    try{
        const settings = readSettingsForm(document.getElementById("pageContent"));
        await saveSettings(session, settings);
        savedSettings = settings;
        window.B2B.toast("Settings saved.");
    }catch(error){
        if(!(error instanceof ValidationError)) console.error("Could not save settings:", error);
        window.B2B.toast(describeError(error, "save your settings"));
    }finally{
        button.disabled = false;
        button.textContent = label;
    }
}

async function initialize(){
    session = await requireRole("Legal Head");

    legalHead.config.backend = {
        saveDecision,
        describeError:error=>describeError(error, "save this decision"),
        saveSettings:saveSettingsSection,
        afterRender:(section, root)=>{
            if(section === "settings") applySettingsForm(root, savedSettings);
        }
    };

    loadSettings(session).then(settings=>{ savedSettings = settings; })
        .catch(error=>console.error("Could not load settings:", error));

    // No seed: proposals without a saved review keep their bundled state.
    watchCollection(REVIEWS, [], applyReviews, error=>{
        console.error("Could not load legal reviews:", error);
        window.B2B.toast(describeError(error, "load saved legal decisions"));
    });
}

initialize().catch(error=>{
    console.error("Could not connect the Legal Head dashboard to Firebase:", error);
    window.B2B.toast("Could not connect to Firebase. Decisions will not be saved.");
});
