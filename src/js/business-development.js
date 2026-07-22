/* ==========================================================
   BEE-TO-BEE OPERATIONS
   BUSINESS DEVELOPMENT OFFICER DASHBOARD LOGIC

   Handles:
   - Dashboard rendering
   - Navigation
   - User profile
   - Overview page

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


    renderOverview();


    B2B.initShell({
        onNavigate: handleNavigation
    });


    B2B.icon();


}





/* ==========================================================
   LOAD USER INFORMATION
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


            <button class="primary-btn">

                <i data-lucide="plus"></i>

                New Site Proposal

            </button>


        </div>





        <!-- KPI CARDS -->


        <div class="stats-grid">


            <div class="stat-card">

                <div class="stat-icon">

                    <i data-lucide="map"></i>

                </div>


                <div>

                    <span>
                        Total Applications
                    </span>


                    <h2>
                        ${stats.totalApplications}
                    </h2>

                </div>


            </div>





            <div class="stat-card">


                <div class="stat-icon">

                    <i data-lucide="building-2"></i>

                </div>


                <div>

                    <span>
                        Active Sites
                    </span>


                    <h2>
                        ${stats.activeSites}
                    </h2>

                </div>


            </div>





            <div class="stat-card">


                <div class="stat-icon">

                    <i data-lucide="cpu"></i>

                </div>


                <div>

                    <span>
                        Average AI Score
                    </span>


                    <h2>
                        ${stats.averageScore}%

                    </h2>

                </div>


            </div>





            <div class="stat-card">


                <div class="stat-icon">

                    <i data-lucide="clock"></i>

                </div>


                <div>

                    <span>
                        Pending Analysis
                    </span>


                    <h2>
                        ${stats.pendingAnalysis}

                    </h2>

                </div>


            </div>



        </div>





        <!-- RECENT APPLICATIONS -->


        <div class="dashboard-section">


            <div class="section-header">


                <h2>
                    Recent Site Applications
                </h2>


                <button
                    class="text-btn"
                    data-section="applications">

                    View All

                </button>


            </div>





            <div class="application-grid">


                ${applications.slice(0,4).map(site => `


                    <div class="application-card">


                        <div class="card-top">


                            <span class="site-id">

                                ${site.id}

                            </span>


                            <span class="status">

                                ${site.status}

                            </span>


                        </div>




                        <h3>

                            ${site.location}

                        </h3>


                        <p>

                            ${site.municipality}

                        </p>




                        <div class="score">


                            <strong>

                                ${site.aiAnalysis.score ?? "N/A"}%

                            </strong>


                            <span>
                                AI Viability Score
                            </span>


                        </div>




                    </div>


                `).join("")}



            </div>


        </div>



    `;



    B2B.icon();


}

function handleNavigation(section){

    console.log("Navigating to:", section);


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

function renderApplications(){

    const content = document.getElementById("pageContent");


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
                    Review submitted franchise locations.
                </p>

            </div>

        </div>


        <div class="dashboard-section">

            <h2>
                All Applications
            </h2>


            ${businessDevelopmentData.applications.map(site => `

                <div class="application-card">

                    <h3>${site.location}</h3>

                    <p>${site.municipality}</p>

                    <span class="status">
                        ${site.status}
                    </span>

                </div>


            `).join("")}


        </div>

    `;

}



function renderAnalysis(){

    document.getElementById("pageContent").innerHTML = `


        <div class="page-header">

            <div>

                <p class="eyebrow">
                    VIABILITY ANALYSIS
                </p>

                <h1>
                    AI Site Evaluation
                </h1>


            </div>

        </div>


        <div class="dashboard-section">


            <h2>
                Location Intelligence
            </h2>


            <p>
                Analyze demographics, traffic,
                competitors, and accessibility.
            </p>


        </div>


    `;


}



function renderRecommendations(){


    document.getElementById("pageContent").innerHTML = `


        <div class="page-header">

            <div>

                <p class="eyebrow">
                    RECOMMENDATIONS
                </p>


                <h1>
                    Expansion Recommendations
                </h1>

            </div>


        </div>



        <div class="dashboard-section">


            <h2>
                High Potential Sites
            </h2>


            ${businessDevelopmentData.recommendations.highPotential.map(item => `


                <div class="application-card">

                    <h3>${item.id}</h3>

                    <p>${item.reason}</p>


                </div>


            `).join("")}


        </div>


    `;


}



function renderArchives(){


    document.getElementById("pageContent").innerHTML = `


        <div class="page-header">


            <div>

                <p class="eyebrow">
                    ARCHIVED SITES
                </p>


                <h1>
                    Archived Expansion Proposals
                </h1>


            </div>


        </div>



        <div class="dashboard-section">


        ${businessDevelopmentData.archives.map(site => `


            <div class="application-card">


                <h3>${site.location}</h3>


                <p>
                    Reason:
                    ${site.reason}
                </p>


                <span class="status">
                    Score ${site.score}%
                </span>


            </div>



        `).join("")}



        </div>


    `;


}