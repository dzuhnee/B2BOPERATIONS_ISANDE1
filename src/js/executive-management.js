const sidebar = document.getElementById('sidebar');
const pageContent = document.getElementById('pageContent');

const overviewHTML = pageContent.innerHTML;



const sectionTemplates = {


expansion: `

<div class="welcome-row">

<div>

<p class="eyebrow">
FRANCHISE DEVELOPMENT
</p>

<h1>
Branch Expansion Pipeline
</h1>

<p>
Monitor franchise applications, approvals, construction progress, and launch readiness.
</p>

</div>

</div>



<div class="stats-grid">


<article class="stat-card">

<div class="stat-icon red">
<i data-lucide="building-2"></i>
</div>

<div>

<span>
Pending Applications
</span>

<strong>
48
</strong>

<small>
Across all regions
</small>

</div>

</article>



<article class="stat-card">

<div class="stat-icon green">
<i data-lucide="circle-check-big"></i>
</div>

<div>

<span>
Approved Sites
</span>

<strong>
31
</strong>

<small>
Ready for deployment
</small>

</div>

</article>



<article class="stat-card">

<div class="stat-icon yellow">
<i data-lucide="hammer"></i>
</div>

<div>

<span>
Construction Phase
</span>

<strong>
18
</strong>

<small>
Currently active
</small>

</div>

</article>




<article class="stat-card">

<div class="stat-icon orange">
<i data-lucide="rocket"></i>
</div>

<div>

<span>
Upcoming Launches
</span>

<strong>
7
</strong>

<small>
Scheduled openings
</small>

</div>

</article>


</div>





<section class="panel">


<div class="panel-heading">

<div>

<h2>
Franchise Pipeline Status
</h2>

<p>
Current expansion progress
</p>

</div>


</div>




<div class="pipeline">


<div class="pipeline-step active">

<strong>
48
</strong>

<span>
Applications
</span>

</div>



<div class="pipeline-step active">

<strong>
41
</strong>

<span>
Approval
</span>

</div>




<div class="pipeline-step active">

<strong>
35
</strong>

<span>
Engineering
</span>

</div>




<div class="pipeline-step">

<strong>
28
</strong>

<span>
Construction
</span>

</div>




<div class="pipeline-step">

<strong>
19
</strong>

<span>
Training
</span>

</div>




<div class="pipeline-step">

<strong>
12
</strong>

<span>
Launch
</span>

</div>




<div class="pipeline-step">

<strong>
7
</strong>

<span>
Operational
</span>

</div>



</div>


</section>

`,





performance: `


<div class="welcome-row">

<div>

<p class="eyebrow">
ENTERPRISE ANALYTICS
</p>

<h1>
Corporate Performance
</h1>

<p>
Analyze organization-wide performance indicators and growth metrics.
</p>

</div>


<div class="date-control">

<i data-lucide="calendar-range"></i>

<span>
Q3 2026
</span>

</div>


</div>





<div class="stats-grid">


<article class="stat-card">


<div class="stat-icon green">

<i data-lucide="trending-up"></i>

</div>


<div>

<span>
Revenue Growth
</span>


<strong>
14.8%
</strong>


<small>
Compared to previous quarter
</small>


</div>


</article>





<article class="stat-card">


<div class="stat-icon red">

<i data-lucide="store"></i>

</div>


<div>

<span>
Active Franchises
</span>


<strong>
126
</strong>


<small>
Across 18 regions
</small>


</div>


</article>





<article class="stat-card">


<div class="stat-icon yellow">

<i data-lucide="clipboard-check"></i>

</div>


<div>

<span>
Pending Approvals
</span>


<strong>
9
</strong>


<small>
Executive review required
</small>


</div>


</article>





<article class="stat-card">


<div class="stat-icon orange">

<i data-lucide="target"></i>

</div>


<div>

<span>
Expansion Goal
</span>


<strong>
82%
</strong>


<small>
Annual target completion
</small>


</div>


</article>



</div>





<div class="dashboard-grid">


<section class="panel">


<div class="panel-heading">

<div>

<h2>
Regional Performance Ranking
</h2>

<p>
Operational performance by region
</p>

</div>

</div>



<div class="branch-list">


<article class="branch-row">


<div class="branch-rank">
1
</div>


<div class="branch-name">

<strong>
Metro Manila
</strong>

<span>
42 branches
</span>

</div>



<div class="score">

<strong>
96%
</strong>

<div>

<span style="width:96%"></span>

</div>

</div>



<span class="status strong">
Excellent
</span>



</article>




<article class="branch-row">


<div class="branch-rank">
2
</div>


<div class="branch-name">

<strong>
Central Luzon
</strong>

<span>
31 branches
</span>

</div>



<div class="score">

<strong>
91%
</strong>

<div>

<span style="width:91%"></span>

</div>

</div>



<span class="status good">
Good
</span>



</article>



</div>


</section>



<section class="panel">


<div class="panel-heading">

<div>

<h2>
Executive Priorities
</h2>

<p>
Current strategic focus
</p>


</div>

</div>



<div class="timeline">


<div class="timeline-item">

<span class="dot red">

<i data-lucide="triangle-alert"></i>

</span>


<div>

<strong>
Resolve delayed launches
</strong>

<p>
Review locations affected by construction delays.
</p>


</div>


</div>





<div class="timeline-item">

<span class="dot green">

<i data-lucide="award"></i>

</span>


<div>

<strong>
Recognize top regions
</strong>

<p>
Share successful operational strategies.
</p>


</div>


</div>



</div>


</section>


</div>

`,



alerts: `

<div class="welcome-row">

<div>

<p class="eyebrow">
EXECUTIVE MONITORING
</p>

<h1>
Executive Alerts
</h1>

<p>
Review critical updates requiring executive attention.
</p>

</div>

</div>




<div class="alert-banner">

<div class="alert-icon">

<i data-lucide="triangle-alert"></i>

</div>


<div>

<strong>
3 high-priority issues require action.
</strong>

<span>
Operational risks affecting expansion timelines.
</span>

</div>


</div>





<div class="stats-grid">


<article class="stat-card">

<div class="stat-icon red">

<i data-lucide="triangle-alert"></i>

</div>


<div>

<span>
Critical Alerts
</span>


<strong>
3
</strong>


<small>
Requires decision
</small>


</div>

</article>




<article class="stat-card">

<div class="stat-icon yellow">

<i data-lucide="clock"></i>

</div>


<div>

<span>
Pending Reviews
</span>


<strong>
5
</strong>


<small>
Awaiting approval
</small>


</div>

</article>




<article class="stat-card">

<div class="stat-icon green">

<i data-lucide="circle-check"></i>

</div>


<div>

<span>
Resolved
</span>


<strong>
18
</strong>


<small>
This month
</small>


</div>

</article>



</div>





<section class="panel">


<div class="panel-heading">

<div>

<h2>
Alert Register
</h2>


<p>
Organization-wide executive concerns
</p>


</div>


</div>




<div class="table-wrap">

<table>


<thead>

<tr>

<th>
Alert
</th>

<th>
Department
</th>

<th>
Priority
</th>

<th>
Status
</th>


</tr>


</thead>




<tbody>



<tr>

<td>

<strong>
Delayed Branch Opening
</strong>

<span>
Construction timeline exceeded
</span>

</td>


<td>
Operations
</td>


<td>

<span class="priority high">
High
</span>

</td>


<td>

<span class="table-status action">
Action Required
</span>

</td>


</tr>





<tr>

<td>

<strong>
Budget Adjustment Request
</strong>

<span>
Additional expansion funds needed
</span>

</td>


<td>
Finance
</td>


<td>

<span class="priority medium">
Medium
</span>

</td>


<td>

<span class="table-status investigating">
Reviewing
</span>

</td>


</tr>





<tr>

<td>

<strong>
Compliance Documentation
</strong>

<span>
Pending regional submission
</span>

</td>


<td>
Legal
</td>


<td>

<span class="priority medium">
Medium
</span>

</td>


<td>

<span class="table-status monitoring">
Monitoring
</span>

</td>


</tr>



</tbody>


</table>


</div>


</section>


`,





reports: `


<div class="welcome-row">


<div>


<p class="eyebrow">
EXECUTIVE REPORTING
</p>


<h1>
Management Reports
</h1>


<p>
View consolidated reports from all business units.
</p>


</div>


</div>





<div class="stats-grid">


<article class="stat-card">


<div class="stat-icon green">

<i data-lucide="file-check"></i>

</div>


<div>

<span>
Generated Reports
</span>


<strong>
26
</strong>


<small>
This quarter
</small>


</div>


</article>




<article class="stat-card">


<div class="stat-icon yellow">

<i data-lucide="clock"></i>

</div>


<div>

<span>
Pending Reports
</span>


<strong>
4
</strong>


<small>
Awaiting submission
</small>


</div>


</article>




<article class="stat-card">


<div class="stat-icon red">

<i data-lucide="database"></i>

</div>


<div>

<span>
Data Issues
</span>


<strong>
2
</strong>


<small>
Needs validation
</small>


</div>


</article>




</div>






<section class="panel">


<div class="panel-heading">


<div>

<h2>
Latest Executive Reports
</h2>


<p>
Business intelligence summaries
</p>


</div>


</div>





<div class="table-wrap">


<table>


<thead>

<tr>

<th>
Report
</th>

<th>
Department
</th>

<th>
Date
</th>

<th>
Status
</th>

</tr>


</thead>




<tbody>


<tr>

<td>

<strong>
Monthly Expansion Report
</strong>

<span>
EXP-0726
</span>

</td>


<td>
Business Development
</td>


<td>
July 22, 2026
</td>


<td>

<span class="table-status monitoring">
Completed
</span>

</td>


</tr>





<tr>

<td>

<strong>
Regional Performance Summary
</strong>

<span>
PERF-0726
</span>

</td>


<td>
Operations
</td>


<td>
July 20, 2026
</td>


<td>

<span class="table-status monitoring">
Completed
</span>

</td>


</tr>



</tbody>


</table>


</div>


</section>


`,





settings: `


<div class="welcome-row">


<div>

<p class="eyebrow">
ACCOUNT SETTINGS
</p>


<h1>
Executive Preferences
</h1>


<p>
Manage profile and notification settings.
</p>


</div>


</div>





<div class="settings-grid">



<section class="panel settings-card">


<div class="panel-heading">

<div>

<h2>
Executive Profile
</h2>


<p>
Information displayed in reports
</p>


</div>

</div>





<div class="settings-form">


<label>
Full Name
</label>


<input value="Maria Santos">





<label>
Position
</label>


<input value="Executive Management" disabled>





<label>
Email Address
</label>


<input value="maria.santos@5joys.com">





<button class="primary-btn compact save-settings">

Save Changes

</button>



</div>



</section>





<section class="panel settings-card">


<div class="panel-heading">

<div>

<h2>
Notifications
</h2>


<p>
Executive updates and alerts
</p>


</div>


</div>





<div class="settings-form toggles">


<label>
<input type="checkbox" checked>
Expansion approvals
</label>



<label>
<input type="checkbox" checked>
Regional performance reports
</label>




<label>
<input type="checkbox" checked>
Critical alerts
</label>




<label>
<input type="checkbox">
Weekly summary email
</label>




<button class="primary-btn compact save-settings">

Update Preferences

</button>


</div>



</section>


</div>


`

};

// ================= FUNCTIONS =================


function initIcons(){

    if(window.lucide){
        lucide.createIcons();
    }

}




function renderSection(section){

    if(section === "overview"){

        pageContent.innerHTML = overviewHTML;

    }

    else{

        pageContent.innerHTML = sectionTemplates[section];

    }


    pageContent.dataset.currentSection = section;


    initIcons();


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}






// ================= MOBILE SIDEBAR =================


document.getElementById("menuBtn")
.addEventListener("click",()=>{

    sidebar.classList.toggle("open");

});






// ================= SIDEBAR NAVIGATION =================


document
.querySelectorAll(".nav-item[data-section]")
.forEach(item=>{


    item.addEventListener("click",()=>{


        document
        .querySelectorAll(".nav-item[data-section]")
        .forEach(nav=>{

            nav.classList.remove("active");

        });



        item.classList.add("active");



        sidebar.classList.remove("open");



        renderSection(
            item.dataset.section
        );


    });


});







// ================= QUICK BUTTON LINKS =================


document.addEventListener("click",e=>{


    const opener =
    e.target.closest("[data-open-section]");



    if(opener){


        const target =
        document.querySelector(
            `.nav-item[data-section="${opener.dataset.openSection}"]`
        );



        if(target){

            target.click();

        }


    }



});








// ================= SEARCH =================


document
.getElementById("globalSearch")
.addEventListener("input",event=>{


    const query =
    event.target.value
    .trim()
    .toLowerCase();



    document
    .querySelectorAll("[data-search]")
    .forEach(item=>{


        item.classList.toggle(

            "hidden-by-search",

            query &&
            !item.dataset.search
            .toLowerCase()
            .includes(query)

        );


    });


});







// ================= SETTINGS BUTTON =================


document.addEventListener("click",e=>{


    if(
        e.target.closest(".save-settings")
    ){

        alert(
        "Executive settings updated successfully."
        );


    }


});








// ================= LOGOUT =================


document
.getElementById("logoutBtn")
.addEventListener("click",()=>{


    localStorage.removeItem(
        "b2bUserRole"
    );


    localStorage.removeItem(
        "b2bUserName"
    );


    window.location.href =
    "index.html";


});







// ================= INITIALIZE =================


initIcons();
