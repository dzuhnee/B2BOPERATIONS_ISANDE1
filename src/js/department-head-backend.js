import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function waitForSignedInUser(){
    return new Promise(resolve=>{
        const unsubscribe = onAuthStateChanged(auth, user=>{
            unsubscribe();
            resolve(user);
        });
    });
}

function formatDate(value){
    if(!value) return new Date().toISOString().slice(0, 10);
    const date = value?.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function mapApplication(application){
    const site = application.location || application.municipality || "Unnamed site";
    const department = document.body.dataset.department;
    const score = Number(application.aiAnalysis?.score ?? application.score ?? 0);
    const workflow = application.workflowStatus || {};

    return {
        ...application.departmentProposal,
        id:application.id,
        site,
        location:[application.municipality, application.province].filter(Boolean).join(", ") || application.municipality || "Location not provided",
        submittedBy:application.submittedBy || "Business Development",
        score:Number.isFinite(score) ? score : 0,
        classification:score >= 85 ? "Highly Viable" : score >= 70 ? "Viable" : "Needs Further Review",
        stage:department ? `${department[0].toUpperCase()}${department.slice(1)}` : "Legal",
        status:workflow[department] || "Pending Review",
        submitted:formatDate(application.submittedDate || application.createdAt),
        deadline:formatDate(application.deadline),
        opening:application.openingDate || "To be determined",
        address:application.formattedAddress || [site, application.municipality, application.province].filter(Boolean).join(", "),
        strengths:application.recommendation || "Proposal submitted for cross-department review.",
        risks:application.risks || "Department review is pending.",
        recommendations:application.recommendation || "Review the proposal and supporting site information.",
        // Real uploads (site photo, land titles) are listed by department-head-dashboard.js.
        documents:application.departmentProposal?.documents || [],
        history:application.departmentProposal?.history || [[
            "Business Development",
            application.submittedBy || "Business Development",
            "Submitted",
            "Proposal submitted for Finance, Legal, Engineering, and Operations review.",
            application.submittedDate || "Today"
        ]],
        workflowStatus:workflow,
        image:application.image || ""
    };
}

async function initialize(){
    const user = await waitForSignedInUser();
    if(!user){
        localStorage.removeItem("loggedInUser");
        location.href = "index.html";
        return;
    }

    onSnapshot(collection(db, "siteApplications"), snapshot=>{
        const applications = snapshot.docs
            .map(item=>mapApplication({ ...item.data(), id:item.id }))
            .sort((left, right)=>right.submitted.localeCompare(left.submitted));
        window.departmentHeadController?.setApplications(applications);
    }, error=>{
        console.error("Could not load department proposals from Firebase:", error);
        window.B2B?.toast("Could not load proposals from Firebase.");
    });
}

initialize().catch(error=>{
    console.error("Could not connect department dashboards to Firebase:", error);
    window.B2B?.toast("Could not connect to Firebase. Department proposals may be out of date.");
});
