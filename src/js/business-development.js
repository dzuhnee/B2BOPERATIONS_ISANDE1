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


<button 
class="primary-btn"
data-section="applications">

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