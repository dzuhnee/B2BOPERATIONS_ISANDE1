/* ==========================================================
   BEE-TO-BEE OPERATIONS
   BUSINESS DEVELOPMENT OFFICER DASHBOARD LOGIC

   Enhanced Version:
   - Dashboard rendering
   - Navigation
   - Site applications
   - Location intelligence
   - Leaflet map
   - Pin placement
   - Viability scoring

========================================================== */


document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Business Development Dashboard Loaded",
        window.businessDevelopmentData
    );

    initializeDashboard();

});



/* ==========================================================
   INITIALIZE DASHBOARD
========================================================== */


function initializeDashboard(){

    if(!window.businessDevelopmentData){

        console.error(
            "Business Development Data not found."
        );

        return;

    }


    loadUserProfile();


    B2B.initShell({

        onNavigate: handleNavigation

    });


    renderOverview();


    B2B.icon();

bindNewSiteProposalButton();

}





/* ==========================================================
   LOAD USER PROFILE
========================================================== */


function loadUserProfile(){

    const user =
    businessDevelopmentData.user;


    const name =
    document.getElementById("userName");


    const role =
    document.getElementById("userRole");


    const initials =
    document.getElementById("userInitials");



    if(name)
        name.textContent = user.name;



    if(role)
        role.textContent = user.role;



    if(initials)
        initials.textContent = user.initials;


}





/* ==========================================================
   OVERVIEW DASHBOARD
========================================================== */


function renderOverview(){


const content =
document.getElementById("pageContent");


const stats =
businessDevelopmentData.stats;


const applications =
businessDevelopmentData.applications;



content.innerHTML = `


<div class="page-header">


<div>


<p class="eyebrow">
BUSINESS DEVELOPMENT
</p>


<h1>
Site Expansion Overview
</h1>


<p class="subtitle">
Monitor proposed locations,
market viability, and expansion opportunities.
</p>


</div>


<button class="primary-btn" id="newSiteProposalBtn" type="button">
<i data-lucide="plus"></i>
New Site Proposal
</button>


</div>





<div class="stats-grid">


${

[
["map","Total Applications",stats.totalApplications],
["building-2","Active Sites",stats.activeSites],
["cpu","Average AI Score",stats.averageScore+"%"],
["clock","Pending Analysis",stats.pendingAnalysis]

]

.map(item=>`


<div class="stat-card">


<div class="stat-icon">

<i data-lucide="${item[0]}"></i>

</div>


<div>

<span>
${item[1]}
</span>


<h2>
${item[2]}
</h2>


</div>


</div>


`).join("")


}



</div>





<div class="dashboard-section">


<div class="section-header">


<h2>
Recent Site Applications
</h2>


</div>



<div class="application-grid">


${

applications.slice(0,4).map(site=>`


<div class="application-card">


<img
class="site-photo"
src="${site.image || 'images/default-site.jpg'}">


<h3>
${site.location}
</h3>


<p>
${site.municipality}
</p>


<span class="status">
${site.status}
</span>



<div class="score">


<strong>

${site.aiAnalysis?.score || "N/A"}%

</strong>


<span>
AI Viability Score
</span>


</div>



</div>


`).join("")


}



</div>


</div>


`;


B2B.icon();


}

/* ==========================================================
   NAVIGATION
========================================================== */


function handleNavigation(section){


    console.log(
    "Navigating to:",
    section
    );
    
    
    
    switch(section){
    
    
    case "overview":
    
    renderOverview();
    
    break;
    
    
    
    case "applications":
    
    renderApplications();
    
    break;
    
    
    
    case "analysis":
    
    renderAnalysis();
    
    break;
    
    
    
    case "recommendations":
    
    renderRecommendations();
    
    break;
    
    
    
    case "archives":
    
    renderArchives();
    
    break;
    
    
    
    default:
    
    renderOverview();
    
    
    }
    
    
    
    B2B.icon();
    
    
    }
    
    
    
    
    
    /* ==========================================================
       SITE APPLICATIONS
       WITH PHOTO VISUALIZATION
    ========================================================== */
    
    
    function renderApplications(){
    
    
    const content =
    document.getElementById("pageContent");
    
    
    
    content.innerHTML = `
    
    
    <div class="page-header">
    
    
    <div>
    
    <p class="eyebrow">
    SITE APPLICATIONS
    </p>
    
    
    <h1>
    Proposed Expansion Sites
    </h1>
    
    
    <p class="subtitle">
    Review locations with area visualization
    and viability results.
    </p>
    
    
    </div>
    
    
    </div>
    
    
    
    
    <div class="application-grid">
    
    
    ${
    
    businessDevelopmentData.applications.map(site=>`
    
    
    <div class="application-card">
    
    
    
    <div class="site-gallery">
    
    
    <img 
    src="${site.image || 'images/default-site.jpg'}"
    alt="Site location image">
    
    
    ${site.images ? site.images.map(img=>`
    
    <img src="${img}">
    
    `).join("") : ""}
    
    
    </div>
    
    
    
    
    <h3>
    ${site.location}
    </h3>
    
    
    <p>
    ${site.municipality}
    </p>
    
    
    
    <span class="status">
    
    ${site.status}
    
    </span>
    
    
    
    
    
    <div class="score">
    
    
    <strong>
    
    ${site.aiAnalysis?.score || "Pending"}%
    
    </strong>
    
    
    <span>
    AI Viability Score
    </span>
    
    
    </div>
    
    
    
    
    <div class="location-summary">
    
    
    <p>
    🏫 Nearby Schools:
    ${site.schools || "Analyzing"}
    
    </p>
    
    
    <p>
    🚶 Foot Traffic:
    ${site.footTraffic || "Analyzing"}
    
    </p>
    
    
    <p>
    🏬 Commercial Activity:
    ${site.commercial || "Analyzing"}
    
    </p>
    
    
    </div>
    
    
    
    
    </div>
    
    
    `).join("")
    
    
    }
    
    
    </div>
    
    
    `;
    
    
    
    B2B.icon();
    
    
    }
    
    
    
    
    
    /* ==========================================================
       VIABILITY ANALYSIS PAGE
    ========================================================== */
    
    
    function renderAnalysis(){
    
    
    const content =
    document.getElementById("pageContent");
    
    
    
    content.innerHTML = `
    
    
    <div class="page-header">
    
    
    <div>
    
    
    <p class="eyebrow">
    VIABILITY ANALYSIS
    </p>
    
    
    <h1>
    AI Site Evaluation
    </h1>
    
    
    <p class="subtitle">
    
    Analyze traffic, nearby establishments,
    schools, accessibility, and competition.
    
    </p>
    
    
    </div>
    
    
    </div>
    
    
    
    
    
    <div class="dashboard-section">
    
    
    
    <div class="analysis-search">
    
    
    <label>
    Enter Site Location
    </label>
    
    
    <div class="location-search-wrapper">

<input
id="analysisLocation"
type="text"
placeholder="Search location..."
autocomplete="off"
>


<div id="locationSuggestions"></div>


</div>
    
    
    
    <button
    
    class="primary-btn"
    
    id="analyzeLocationBtn"
    
    >
    
    Analyze Location
    
    </button>
    
    
    </div>
    
    
    
    
    
    <div
    
    id="analysisMap"
    
    style="
    height:450px;
    margin-top:20px;
    border-radius:15px;
    "
    
    ></div>
    
    
    
    
    
    <div class="score-breakdown-card">
    
    
    <h2>
    Viability Result
    </h2>
    
    
    
    <div class="viability-result">
    
    
    <h1 id="analysisScore">
    
    --
    
    </h1>
    
    
    
    <p id="analysisSummary">
    
    Waiting for location analysis...
    
    </p>
    
    
    
    </div>
    
    
    
    
    
    <div class="score-breakdown-row">
    
    
    <span>
    Foot Traffic
    </span>
    
    
    <strong id="trafficResult">
    --
    </strong>
    
    
    </div>
    
    
    
    <div class="score-breakdown-row">
    
    
    <span>
    Schools Nearby
    </span>
    
    
    <strong id="schoolResult">
    --
    </strong>
    
    
    </div>
    
    
    
    
    <div class="score-breakdown-row">
    
    
    <span>
    Accessibility
    </span>
    
    
    <strong id="accessResult">
    --
    </strong>
    
    
    </div>
    
    
    
    <div class="score-breakdown-row">
    
    
    <span>
    Competition
    </span>
    
    
    <strong id="competitionResult">
    --
    </strong>
    
    
    </div>
    
    
    
    
    </div>
    
    
    
    
    </div>
    
    
    `;
    
    
    
    initializeAnalysisMap();
    
    initializeLocationAutocomplete();
    
    }

    const analysisInput =
document.getElementById("analysisLocation");


const suggestions =
document.getElementById("locationSuggestions");



if(analysisInput){


analysisInput.addEventListener(
"input",
async function(){


const query =
this.value;


if(query.length < 3){

suggestions.innerHTML="";
return;

}



const response =
await fetch(

`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query + ", Philippines")}`

);



const places =
await response.json();



suggestions.innerHTML="";



places.forEach(place=>{


const item =
document.createElement("div");


item.className =
"location-suggestion";


item.textContent =
place.display_name;



item.onclick = ()=>{


analysisInput.value =
place.display_name;


suggestions.innerHTML="";



pinSelectedLocation(
parseFloat(place.lat),
parseFloat(place.lon),
place.display_name
);



};



suggestions.appendChild(item);


});



});


function pinSelectedLocation(lat,lng,address){



    analysisMap.setView(
    [lat,lng],
    16
    );
    
    
    
    if(analysisMarker){
    
    analysisMap.removeLayer(
    analysisMarker
    );
    
    }
    
    
    
    analysisMarker =
    L.marker(
    [lat,lng],
    {
    draggable:true
    }
    )
    .addTo(
    analysisMap
    );
    
    
    
    analysisMarker.on(
    "dragend",
    function(e){
    
    
    const position =
    e.target.getLatLng();
    
    
    updateLocationFromPin(
    position.lat,
    position.lng
    );
    
    
    calculateViability(
    position.lat,
    position.lng
    );
    
    
    });
    
    
    document.getElementById(
    "analysisLocation"
    ).value =
    address;
    
    
    
    calculateViability(
    lat,
    lng
    );
    
    
    }


}
    
    
    
    
    
    /* ==========================================================
       MAP SYSTEM
    ========================================================== */
    
    
    let analysisMap;
    
    let analysisMarker;
    
    
    
    
    
    function initializeAnalysisMap(){
    
    
    if(!window.L){
    
    console.error(
    "Leaflet not loaded"
    );
    
    return;
    
    }
    
    
    
    analysisMap = L.map(
    "analysisMap"
    )
    .setView(
    [14.5995,120.9842],
    13
    );
    
    
    
    L.tileLayer(
    
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    
    {
    
    attribution:
    "© OpenStreetMap"
    
    }
    
    ).addTo(
    analysisMap
    );


    
    analysisMap.on(
    "click",
    function(e){
    
    
    if(analysisMarker){
    
    analysisMap.removeLayer(
    analysisMarker
    );
    
    }
    
    
    
    analysisMarker =
    L.marker(
    e.latlng,
    {
    draggable:true
    }
    
    )
    .addTo(
    analysisMap
    );

    analysisMarker.on("dragend", function(e){

        const position = e.target.getLatLng();
    
    
        updateLocationFromPin(
            position.lat,
            position.lng
        );
    
    
    });
    
    
    
    updateLocationFromPin(
        e.latlng.lat,
        e.latlng.lng
    );
    
    
    calculateViability(
        e.latlng.lat,
        e.latlng.lng
    );
    
    
    
    }
    
    
    );
    
    
    
    
    
    const button =
    document.getElementById(
    "analyzeLocationBtn"
    );
    
    
    
    if(button){
    
    
        button.addEventListener(
            "click",
            ()=>{
            
            
            const location =
            document.getElementById(
            "analysisLocation"
            ).value;
            
            
            
            if(!location){
            
            return;
            
            }
            
            
            searchAnalysisLocation(location);
            
            
            }
            );
    
    
    }
    
    
    
    }



/* ==========================================================
   VIABILITY SCORING ENGINE
========================================================== */

async function searchAnalysisLocation(query){


    try{
    
    
    const response =
    await fetch(
    
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query + ", Bulacan, Philippines")}`
    
    );
    
    
    
    const places =
    await response.json();
    
    
    
    if(!places.length){
    
    alert("Location not found");
    
    return;
    
    }
    
    
    // pick first result inside Bulacan if available
    
    const place =
    places.find(p =>
    p.display_name.includes("Bulacan")
    )
    ||
    places[0];
    
    
    
    pinSelectedLocation(
    
    parseFloat(place.lat),
    
    parseFloat(place.lon),
    
    place.display_name
    
    );
    
    
    
    }
    
    
    catch(error){
    
    console.error(
    "Search failed:",
    error
    );
    
    }
    
    
    }

function calculateViability(lat,lng){


    /*
        CURRENT VERSION:
        Simulated intelligence scoring
    
        Replace these values with:
        - Google Places API
        - OpenStreetMap Overpass API
        - Traffic API
        - Demographic API
    
    */
    
    
    const factors = {
    
    
        footTraffic: randomBetween(75,95),
    
        schools: randomBetween(70,95),
    
        commercialActivity: randomBetween(75,95),
    
        accessibility: randomBetween(75,95),
    
        competition: randomBetween(65,90)
    
    
    };
    
    
    
    
    
    const finalScore = Math.round(
    
    
        factors.footTraffic * 0.30 +
    
        factors.schools * 0.15 +
    
        factors.commercialActivity * 0.20 +
    
        factors.accessibility * 0.20 +
    
        factors.competition * 0.15
    
    
    );
    
    
    
    
    
    updateAnalysisUI(
        finalScore,
        factors
    );
    
    
    
    }
    
    
    
    
    
    /* ==========================================================
       UPDATE SCORE DISPLAY
    ========================================================== */
    
    
    function updateAnalysisUI(score,factors){
    
    
    
    const scoreElement =
    document.getElementById(
    "analysisScore"
    );
    
    
    
    const summary =
    document.getElementById(
    "analysisSummary"
    );
    
    
    
    
    
    if(scoreElement){
    
    scoreElement.textContent =
    score + "/100";
    
    }
    
    
    
    
    if(summary){
    
    
    let message;
    
    
    
    if(score >= 85){
    
    message =
    "Excellent potential location. Strong market drivers detected.";
    
    }
    
    
    else if(score >=70){
    
    message =
    "Good potential. Location shows positive expansion indicators.";
    
    }
    
    
    else{
    
    
    message =
    "Moderate potential. Additional review recommended.";
    
    }
    
    
    
    summary.textContent =
    message;
    
    
    }
    
    
    
    
    
    const fields = {
    
    
    trafficResult:
    factors.footTraffic,
    
    
    schoolResult:
    factors.schools,
    
    
    accessResult:
    factors.accessibility,
    
    
    competitionResult:
    factors.competition
    
    
    };
    
    
    
    
    
    Object.keys(fields).forEach(id=>{
    
    
    const element =
    document.getElementById(id);
    
    
    
    if(element){
    
    element.textContent =
    fields[id]+"/100";
    
    }
    
    
    });
    
    
    }
    
    
    
    
    
    /* ==========================================================
       RANDOM DEMO DATA
       Replace with API RESULTS
    ========================================================== */
    
    
    function randomBetween(min,max){
    
    
    return Math.floor(
    
    Math.random() *
    (max-min+1)
    
    )+min;
    
    
    }
    
    
    
    
    
    /* ==========================================================
       FUTURE API CONNECTIONS
    ========================================================== */
    
    
    
    async function getLocationData(lat,lng){
    
    
    
    /*
    
    Example future structure:
    
    
    return {
    
    schools:12,
    
    competitors:8,
    
    malls:4,
    
    transportStops:15,
    
    populationDensity:8500,
    
    trafficScore:90
    
    }
    
    
    */
    
    
    
    return null;
    
    
    }
    
    
    
    
    
    async function analyzeRealLocation(lat,lng){
    
    
    
    const data =
    await getLocationData(
    lat,
    lng
    );
    
    
    
    if(!data){
    
    console.log(
    "No API connected yet"
    );
    
    return;
    
    }
    
    
    
    const score =
    calculateRealScore(
    data
    );
    
    
    
    return score;
    
    
    }
    
    
    
    
    
    function calculateRealScore(data){
    
    
    
    return Math.round(
    
    
    data.trafficScore * .30 +
    
    data.schoolsScore * .15 +
    
    data.commercialScore * .20 +
    
    data.accessibilityScore * .20 +
    
    data.competitionScore * .15
    
    
    );
    
    
    }
    
    
    
    
    
    /* ==========================================================
       RECOMMENDATIONS
    ========================================================== */
    
    
    function renderRecommendations(){
    
    
    const content =
    document.getElementById(
    "pageContent"
    );
    
    
    
    content.innerHTML = `
    
    
    <div class="page-header">
    
    
    <p class="eyebrow">
    RECOMMENDATIONS
    </p>
    
    
    <h1>
    Expansion Recommendations
    </h1>
    
    
    </div>
    
    
    
    
    <div class="dashboard-section">
    
    
    <h2>
    High Potential Sites
    </h2>
    
    
    
    ${
    businessDevelopmentData.recommendations.highPotential
    .map(item=>`
    
    
    <div class="application-card">
    
    
    <h3>
    ${item.id}
    </h3>
    
    
    <p>
    ${item.reason}
    </p>
    
    
    </div>
    
    
    `).join("")
    }
    
    
    
    </div>
    
    
    `;
    
    
    
    B2B.icon();
    
    
    }
    
    
    
    
    
    
    
    /* ==========================================================
       ARCHIVES
    ========================================================== */
    
    
    function renderArchives(){
    
    
    const content =
    document.getElementById(
    "pageContent"
    );
    
    
    
    content.innerHTML = `
    
    
    <div class="page-header">
    
    
    <p class="eyebrow">
    ARCHIVED SITES
    </p>
    
    
    <h1>
    Archived Expansion Proposals
    </h1>
    
    
    </div>
    
    
    
    <div class="dashboard-section">
    
    
    ${
    businessDevelopmentData.archives
    .map(site=>`
    
    
    <div class="application-card">
    
    
    <h3>
    ${site.location}
    </h3>
    
    
    <p>
    Reason:
    ${site.reason}
    </p>
    
    
    <span class="status">
    
    Score ${site.score}%
    
    </span>
    
    
    </div>
    
    
    `).join("")
    }
    
    
    </div>
    
    
    `;
    
    
    
    B2B.icon();
    
    
    }
    
    /* ==========================================
   LOCATION SEARCH + MAP PINNING
========================================== */


document.addEventListener("DOMContentLoaded", ()=>{


    const searchBtn =
    document.getElementById("searchLocationBtn");
    
    
    const searchInput =
    document.getElementById("locationSearch");
    
    
    
    if(searchBtn){
    
    
    searchBtn.addEventListener(
    "click",
    ()=>{
    
    
    const query =
    searchInput.value;
    
    
    if(!query) return;
    
    
    searchLocation(query);
    
    
    }
    
    );
    
    
    }
    
    
    
    });
    
    
    
    
    
    async function searchLocation(query){
    
    
    try{
    
    
    const response =
    await fetch(
    
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Philippines")}`
    
    );
    
    
    
    const data =
    await response.json();
    
    
    
    if(data.length === 0){
    
    alert("Location not found");
    
    return;
    
    }
    
    
    
    const location =
    data[0];
    
    
    
    const lat =
    parseFloat(location.lat);
    
    
    
    const lon =
    parseFloat(location.lon);
    
    
    
    
    /*
    MOVE MAP
    */
    
    
    proposalMap.setView(
    [lat,lon],
    16
    );
    
    
    
    /*
    REMOVE OLD MARKER
    */
    
    
    if(proposalMarker){
    
    proposalMap.removeLayer(
    proposalMarker
    );
    
    }
    
    
    
    
    /*
    CREATE NEW PIN
    */
    
    
    proposalMarker =
L.marker(
[lat,lon],
{
draggable:true
}
)
.addTo(proposalMap);



proposalMarker.on(
"dragend",
function(e){

    const position =
    e.target.getLatLng();


    document.getElementById("latitude").value =
    position.lat;


    document.getElementById("longitude").value =
    position.lng;


    updateLocationFromPin(
        position.lat,
        position.lng
    );

}

);
    
    
    
    /*
    UPDATE FORM
    */
    
    
    document.getElementById("latitude").value =
    lat;
    
    
    document.getElementById("longitude").value =
    lon;
    
    
    document.getElementById("formattedAddress").value =
    location.display_name;
    
    
    
    document.getElementById("municipality").value =
    query;
    
    
    
    }
    
    catch(error){
    
    console.error(
    "Location search failed:",
    error
    );
    
    }
    
    
    }

    async function updateLocationFromPin(lat, lng){

        try{
    
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
    
    
            const data = await response.json();
    
    
    
            if(data.display_name){
    
    
                const analysisInput =
                document.getElementById("analysisLocation");
    
    
                if(analysisInput){
    
                    analysisInput.value =
                    data.display_name;
    
                }
    
    
            }
    
    
        }
        catch(error){
    
            console.error(
                "Reverse geocoding failed:",
                error
            );
    
        }
    
    }
    
    
    
    
    /* ==========================================================
       END OF BUSINESS DEVELOPMENT DASHBOARD
    ========================================================== */

/* ==========================================================
   NEW SITE PROPOSAL - FUNCTIONAL CONTROLS
========================================================== */

let proposalMap = null;
let proposalMarker = null;
let proposalRadiusCircle = null;
let currentProposalAssessment = null;

function bindNewSiteProposalButton(){
    const button = document.getElementById("newSiteProposalBtn");
    if(!button || button.dataset.bound === "true") return;

    button.dataset.bound = "true";
    button.addEventListener("click", ()=>{
        B2B.openModal("proposalModal");
        initializeProposalMap();
        setTimeout(()=>proposalMap?.invalidateSize(), 120);
    });
}

function initializeProposalControls(){
    B2B.bindModal("proposalModal");
    B2B.bindModal("analysisModal");
    B2B.bindModal("proposalSuccessModal");
    B2B.bindModal("siteModal");

    const radius = document.getElementById("analysisRadius");
    radius?.addEventListener("input", ()=>{
        const meters = Number(radius.value);
        const text = meters >= 1000 ? `${(meters/1000).toFixed(1)} km` : `${meters} m`;
        const label = document.getElementById("analysisRadiusValue");
        if(label) label.textContent = text;
        proposalRadiusCircle?.setRadius(meters);
    });

    document.getElementById("useCurrentLocationBtn")?.addEventListener("click", ()=>{
        if(!navigator.geolocation){
            alert("Current location is not supported by this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(position=>{
            initializeProposalMap();
            placeProposalMarker(position.coords.latitude, position.coords.longitude, true);
        }, ()=>alert("Unable to access your current location."));
    });

    document.getElementById("landTitleFiles")?.addEventListener("change", renderProposalFiles);

    document.getElementById("assessSiteBtn")?.addEventListener("click", ()=>{
        if(!validateProposalFields()) return;
        B2B.openModal("analysisModal");
    });

    document.getElementById("runAnalysis")?.addEventListener("click", runProposalViabilityAssessment);
    document.getElementById("siteProposalForm")?.addEventListener("submit", submitNewSiteProposal);

    document.getElementById("viewSubmittedSiteBtn")?.addEventListener("click", ()=>{
        B2B.closeModal("proposalSuccessModal");
        B2B.closeModal("proposalModal");
        renderApplications();
        document.querySelectorAll('.nav-item[data-section]').forEach(item=>{
            item.classList.toggle('active', item.dataset.section === 'applications');
        });
    });
}

function initializeProposalMap(){
    const mapContainer = document.getElementById("proposalMap");
    if(!mapContainer || !window.L) return;

    if(proposalMap){
        proposalMap.invalidateSize();
        return;
    }

    proposalMap = L.map("proposalMap").setView([14.5995,120.9842],13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution:"© OpenStreetMap"
    }).addTo(proposalMap);

    proposalMap.on("click", event=>{
        placeProposalMarker(event.latlng.lat,event.latlng.lng,true);
    });
}

function placeProposalMarker(lat,lng,reverseLookup=false){
    initializeProposalMap();
    if(!proposalMap) return;

    if(!proposalMarker){
        proposalMarker=L.marker([lat,lng],{draggable:true}).addTo(proposalMap);
        proposalMarker.on("dragend", event=>{
            const p=event.target.getLatLng();
            updateProposalCoordinates(p.lat,p.lng);
            updateProposalRadius(p.lat,p.lng);
            reverseProposalLocation(p.lat,p.lng);
        });
    }else{
        proposalMarker.setLatLng([lat,lng]);
    }

    proposalMap.setView([lat,lng],16);
    updateProposalCoordinates(lat,lng);
    updateProposalRadius(lat,lng);
    if(reverseLookup) reverseProposalLocation(lat,lng);
}

function updateProposalCoordinates(lat,lng){
    const latInput=document.getElementById("latitude");
    const lngInput=document.getElementById("longitude");
    if(latInput) latInput.value=Number(lat).toFixed(6);
    if(lngInput) lngInput.value=Number(lng).toFixed(6);
}

function updateProposalRadius(lat,lng){
    if(!proposalMap) return;
    const radius=Number(document.getElementById("analysisRadius")?.value||1500);
    if(proposalRadiusCircle){
        proposalRadiusCircle.setLatLng([lat,lng]);
        proposalRadiusCircle.setRadius(radius);
    }else{
        proposalRadiusCircle=L.circle([lat,lng],{radius,weight:2,fillOpacity:.08}).addTo(proposalMap);
    }
}

async function reverseProposalLocation(lat,lng){
    try{
        const response=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`);
        const data=await response.json();
        const address=data.address||{};
        const formatted=document.getElementById("formattedAddress");
        const municipality=document.getElementById("municipality");
        const province=document.getElementById("province");
        if(formatted) formatted.value=data.display_name||`${lat}, ${lng}`;
        if(municipality) municipality.value=address.city||address.municipality||address.town||address.village||"";
        if(province) province.value=address.state||address.region||address.province||"";
    }catch(error){
        console.error("Reverse geocoding failed:",error);
        const formatted=document.getElementById("formattedAddress");
        if(formatted) formatted.value=`${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
    }
}

function renderProposalFiles(event){
    const container=document.getElementById("uploadedFiles");
    if(!container) return;
    const files=Array.from(event.target.files||[]);
    container.innerHTML=files.map(file=>`<div class="uploaded-file-row"><i data-lucide="file-check-2"></i><div><strong>${escapeProposalHtml(file.name)}</strong><span>${formatProposalBytes(file.size)}</span></div></div>`).join("");
    B2B.icon();
}

function formatProposalBytes(bytes){
    if(bytes<1024) return `${bytes} B`;
    if(bytes<1048576) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1048576).toFixed(1)} MB`;
}

function validateProposalFields(){
    const required=["locationSearch","latitude","longitude","formattedAddress","municipality","monthlyRent","leaseTerm","lotArea","floorArea","frontage","propertyType"];
    for(const id of required){
        const field=document.getElementById(id);
        if(!field||!String(field.value).trim()){
            field?.focus();
            B2B.toast("Complete the required site details before assessment.");
            return false;
        }
    }
    return true;
}

function runProposalViabilityAssessment(){
    B2B.closeModal("analysisModal");

    const rent=Number(document.getElementById("monthlyRent")?.value||0);
    const floor=Number(document.getElementById("floorArea")?.value||1);
    const frontage=Number(document.getElementById("frontage")?.value||0);
    const parking=Number(document.getElementById("parkingSlots")?.value||0);

    const footTraffic=randomBetween(72,94);
    const accessibility=randomBetween(74,96);
    const competitors=randomBetween(63,88);
    const lease=Math.max(45,Math.min(96,Math.round(94-(rent/floor)*.055)));
    const property=Math.max(55,Math.min(98,Math.round(62+Math.min(floor/12,18)+Math.min(frontage,12)+Math.min(parking,8))));
    const score=Math.round(footTraffic*.25+accessibility*.25+competitors*.15+lease*.18+property*.17);

    currentProposalAssessment={score,footTraffic,accessibility,competitors,lease,property};
    const status=score>=85?"High Potential":score>=70?"Moderate Potential":"Needs Further Review";

    const values={
        viabilityScore:score,
        viabilityStatus:status,
        viabilityExplanation:score>=85?"Strong location and property indicators support expansion.":score>=70?"The site is viable, but selected factors need review.":"Additional validation is recommended before endorsement.",
        footTrafficScore:`${footTraffic}/100`,accessibilityScore:`${accessibility}/100`,
        footTrafficBreakdown:`${footTraffic}/100`,accessibilityBreakdown:`${accessibility}/100`,
        competitorBreakdown:`${competitors}/100`,leaseBreakdown:`${lease}/100`,propertyBreakdown:`${property}/100`,
        competitorCount:randomBetween(2,8),mallCount:randomBetween(1,5),schoolCount:randomBetween(3,12),transportCount:randomBetween(4,15),analysisState:"Assessment complete"
    };
    Object.entries(values).forEach(([id,value])=>{const e=document.getElementById(id);if(e)e.textContent=value;});

    const submit=document.getElementById("submitProposalBtn");
    if(submit) submit.disabled=false;
    B2B.toast("Site viability assessment completed.");
}

function submitNewSiteProposal(event){
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.checkValidity()){form.reportValidity();return;}
    if(!currentProposalAssessment){B2B.toast("Assess the site before submitting.");return;}

    const generatedId=`SP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const location=document.getElementById("locationSearch").value.trim();
    const municipality=document.getElementById("municipality").value.trim();
    const status=currentProposalAssessment.score>=85?"Recommended":"Pending Review";

    businessDevelopmentData.applications.unshift({
        id:generatedId,
        location,
        municipality,
        image:"images/default-site.jpg",
        status,
        aiAnalysis:{score:currentProposalAssessment.score},
        schools:document.getElementById("schoolCount")?.textContent||"Analyzing",
        footTraffic:`${currentProposalAssessment.footTraffic}/100`,
        commercial:"Assessment completed"
    });

    businessDevelopmentData.stats.totalApplications=Number(businessDevelopmentData.stats.totalApplications||0)+1;
    businessDevelopmentData.stats.pendingAnalysis=Number(businessDevelopmentData.stats.pendingAnalysis||0)+1;
    const count=document.getElementById("applicationCount");
    if(count) count.textContent=businessDevelopmentData.applications.length;
    document.getElementById("generatedSiteId").textContent=generatedId;
    document.getElementById("submittedViabilityStatus").textContent=status;

    B2B.openModal("proposalSuccessModal");
    form.reset();
    currentProposalAssessment=null;
    const submit=document.getElementById("submitProposalBtn");
    if(submit) submit.disabled=true;
    const uploads=document.getElementById("uploadedFiles");
    if(uploads) uploads.innerHTML="";
}

function escapeProposalHtml(value){
    return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[char]));
}

document.addEventListener("DOMContentLoaded",initializeProposalControls);
