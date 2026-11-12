import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    collection,
    doc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const state = {
    stats: {},
    applications: [],
    reviews: new Map(),
    activeApplication: null
};

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[character]));

function showToast(message){
    const toast = document.getElementById("toast");
    if(!toast) return;
    toast.querySelector("span").textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(()=>toast.classList.remove("show"), 2800);
}

function numericValue(value, fallback){
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function updateMetric(valueId, labelId, value, label){
    const valueElement = document.getElementById(valueId);
    const labelElement = document.getElementById(labelId);
    if(valueElement) valueElement.textContent = value;
    if(labelElement) labelElement.textContent = label;
}

function renderMetrics(){
    const stats = state.stats;
    updateMetric("totalProjectsValue", "totalProjectsLabel",
        numericValue(stats.totalApplications, state.applications.length), "Across all site proposals");
    updateMetric("approvedSitesValue", "approvedSitesLabel",
        numericValue(stats.approvedSites, 0), "Approved site proposals");
    updateMetric("activeProjectsValue", "activeProjectsLabel",
        numericValue(stats.activeSites, 0), "Currently in the pipeline");
    updateMetric("highRiskValue", "highRiskLabel",
        numericValue(stats.pendingAnalysis, 0), "Awaiting assessment");
}

function renderProjectList(){
    const container = document.getElementById("executiveProjectList");
    if(!container) return;

    const applications = state.applications.slice(0, 5);
    if(!applications.length){
        container.innerHTML = '<p class="subtitle">No site applications found.</p>';
        return;
    }

    container.innerHTML = applications.map((application, index)=>{
        const score = Number(application.aiAnalysis?.score ?? application.score);
        const hasScore = Number.isFinite(score);
        const status = application.status || "Status unavailable";
        const location = application.municipality || application.location || "Unnamed site";
        const tone = /approved|ready|active/i.test(status) ? "good" : "monitoring";
        return `<article class="branch-row">
            <div class="branch-rank">${index + 1}</div>
            <div class="branch-name"><strong>${escapeHtml(location)}</strong><span>${escapeHtml(application.id)} • ${escapeHtml(status)}</span></div>
            <div class="score"><strong>${hasScore ? `${score}%` : "—"}</strong><div><span style="width:${hasScore ? Math.max(0, Math.min(100, score)) : 0}%"></span></div></div>
            <span class="status ${tone}">${escapeHtml(status)}</span>
        </article>`;
    }).join("");
}

function renderApplicationsTable(){
    const body = document.getElementById("executiveApplicationsTable");
    if(!body) return;

    if(!state.applications.length){
        body.innerHTML = '<tr><td colspan="7">No site applications found.</td></tr>';
        return;
    }

    body.innerHTML = state.applications.map(application=>{
        const workflow = application.workflowStatus || {};
        const review = state.reviews.get(application.id);
        const reviewLabel = review?.note ? "Update note" : "Add note";
        return `<tr data-search="${escapeHtml(`${application.id} ${application.location} ${application.municipality} ${application.status}`)}">
            <td><strong>${escapeHtml(application.location || "Unnamed site")}</strong><span>${escapeHtml(application.id)} • ${escapeHtml(application.municipality || "")}</span></td>
            <td>${escapeHtml(workflow.departmentReview || "Not started")}</td>
            <td>${escapeHtml(workflow.legal || "Not started")}</td>
            <td>${escapeHtml(workflow.engineering || "Not started")}</td>
            <td>${escapeHtml(workflow.finance || "Not started")}</td>
            <td>${escapeHtml(application.status || "Unknown")}</td>
            <td><button class="review-btn" type="button" data-executive-review="${escapeHtml(application.id)}">${reviewLabel}</button></td>
        </tr>`;
    }).join("");
}

function render(){
    renderMetrics();
    renderProjectList();
    renderApplicationsTable();
    if(window.lucide) window.lucide.createIcons();
}

function openReview(applicationId){
    const application = state.applications.find(item=>item.id === applicationId);
    if(!application) return;

    state.activeApplication = application;
    document.getElementById("modalTitle").textContent = `Executive Review: ${application.location || application.id}`;
    document.getElementById("managerNote").value = state.reviews.get(applicationId)?.note || "";
    const modal = document.getElementById("reviewModal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("managerNote").focus();
}

function closeReview(){
    const modal = document.getElementById("reviewModal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.activeApplication = null;
}

async function saveReview(){
    const application = state.activeApplication;
    if(!application || !auth.currentUser) return;

    const saveButton = document.getElementById("saveReview");
    const note = document.getElementById("managerNote").value.trim();
    if(!note){
        document.getElementById("managerNote").focus();
        showToast("Add an executive note before saving.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    saveButton.disabled = true;
    try{
        await setDoc(doc(db, "executiveReviews", application.id), {
            applicationId: application.id,
            siteName: application.location || "",
            note,
            reviewedBy: auth.currentUser.uid,
            reviewerName: user.name || auth.currentUser.displayName || auth.currentUser.email,
            updatedAt: serverTimestamp()
        });
        closeReview();
        showToast("Executive review saved to Firebase.");
    }catch(error){
        console.error("Could not save executive review:", error);
        showToast("Could not save the executive review. Check Firebase access.");
    }finally{
        saveButton.disabled = false;
    }
}

async function initialize(){
    const user = await new Promise(resolve=>{
        const unsubscribe = onAuthStateChanged(auth, signedInUser=>{
            unsubscribe();
            resolve(signedInUser);
        });
    });

    if(!user){
        localStorage.removeItem("loggedInUser");
        location.href = "index.html";
        return;
    }

    onSnapshot(doc(db, "businessDevelopment", "dashboard"), snapshot=>{
        state.stats = snapshot.exists() ? snapshot.data().stats || {} : {};
        render();
    }, error=>{
        console.error("Could not load executive dashboard metrics:", error);
        showToast("Could not load dashboard metrics from Firebase.");
    });

    onSnapshot(collection(db, "siteApplications"), snapshot=>{
        state.applications = snapshot.docs
            .map(item=>({ id:item.id, ...item.data() }))
            .sort((left, right)=>(left.order ?? 0) - (right.order ?? 0));
        render();
    }, error=>{
        console.error("Could not load site applications:", error);
        showToast("Could not load site applications from Firebase.");
    });

    onSnapshot(collection(db, "executiveReviews"), snapshot=>{
        state.reviews = new Map(snapshot.docs.map(item=>[item.id, item.data()]));
        renderApplicationsTable();
    }, error=>{
        console.error("Could not load executive reviews:", error);
        showToast("Could not load executive review notes from Firebase.");
    });
}

document.addEventListener("click", event=>{
    const reviewButton = event.target.closest("[data-executive-review]");
    if(reviewButton) openReview(reviewButton.dataset.executiveReview);
    if(event.target.closest("#cancelModal, .modal-close") || event.target.id === "reviewModal") closeReview();
    if(event.target.closest("#saveReview")) saveReview();
});

initialize().catch(error=>{
    console.error("Could not initialize executive Firebase backend:", error);
    showToast("Could not connect the executive dashboard to Firebase.");
});