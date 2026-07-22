/* ==========================================================
   BEE-TO-BEE OPERATIONS
   BUSINESS DEVELOPMENT OFFICER DATA SOURCE

   Contains:
   - User information
   - Dashboard statistics
   - Alerts
   - AI recommendation templates
   - Site Applications 1-4

========================================================== */


window.businessDevelopmentData = {


    /* ======================================================
       USER PROFILE
    ====================================================== */

    user: {

        name: "Juan Dela Cruz",

        initials: "JD",

        role: "Business Development Officer",

        department: "Business Development"

    },



    /* ======================================================
       DASHBOARD STATISTICS
    ====================================================== */

    stats: {

        totalApplications: 14,

        activeSites: 7,

        pendingAnalysis: 3,

        approvedSites: 5,

        archivedSites: 3,

        averageScore: 84,


        monthlyGrowth: "+18%",

        conversionRate: "72%",

        evaluationTime: "2.4 days"

    },



    /* ======================================================
       OFFICER ALERTS
    ====================================================== */

    alerts: [

        {

            id: 1,

            type: "warning",

            title: "3 Applications Need Validation",

            message:
            "Several proposed locations require additional market verification.",

            date: "Today"

        },


        {

            id: 2,

            type: "success",

            title: "Site SP-2026-027 Ready",

            message:
            "Antipolo Vista Mall passed initial viability assessment.",

            date: "Today"

        },


        {

            id: 3,

            type: "info",

            title: "Department Review Pending",

            message:
            "SP-2026-041 is waiting for cross-department approval.",

            date: "Yesterday"

        }

    ],



    /* ======================================================
       AI ANALYSIS CONFIGURATION

       Used when generating recommendations
    ====================================================== */

    aiInsights: {


        scoringFactors: [

            "Demographic Potential",

            "Customer Traffic",

            "Competitor Density",

            "Accessibility",

            "Lease Affordability"

        ],



        recommendationLevels: {


            excellent: {

                minimumScore: 90,

                label: "High Potential",

                color: "green"

            },


            good: {

                minimumScore: 80,

                label: "Promising Opportunity",

                color: "blue"

            },


            moderate: {

                minimumScore: 70,

                label: "Needs Validation",

                color: "orange"

            },


            low: {

                minimumScore: 0,

                label: "Risk Assessment Required",

                color: "red"

            }


        },


        generatedMessage:

        "AI evaluation completed using demographic, traffic, competitor, accessibility, and commercial indicators."

    },




    /* ======================================================
       SITE APPLICATION DATABASE
       PART 1

       Applications:
       SP-2026-027
       SP-2026-035
       SP-2026-038
       SP-2026-041

    ====================================================== */


    applications: [



        /* ==================================================
           APPLICATION 1
        ================================================== */


        {

            id: "SP-2026-027",

            location: "Antipolo Vista Mall",

            municipality: "Antipolo City, Rizal",


            status: "Ready for Submission",


            submittedDate: "July 10, 2026",


            submittedBy:
            "Juan Dela Cruz",



            category:

            "Commercial Mall Expansion",



            aiAnalysis: {


                evaluated: true,


                score: 92,


                demographics: 95,


                traffic: 91,


                competitors: 84,


                accessibility: 97,


                lease: 89



            },



            businessProfile: {


                estimatedCustomers:

                "12,000 - 15,000 daily visitors",



                marketSegment:

                "Families, students, and mall shoppers",



                nearbyEstablishments: [

                    "Vista Mall Antipolo",

                    "Banks",

                    "Retail Stores",

                    "Residential Communities"

                ]

            },



            recommendation:

            "Highly recommended due to strong customer traffic, accessibility, and growing residential demand.",



            workflowStatus: {


                departmentReview:

                "Pending Submission",


                legal:

                "Not Started",


                engineering:

                "Not Started",


                finance:

                "Not Started"

            }

        },





        /* ==================================================
           APPLICATION 2
        ================================================== */


        {

            id: "SP-2026-035",


            location:

            "SM City Fairview Annex",


            municipality:

            "Quezon City",



            status:

            "Under Analysis",



            submittedDate:

            "July 13, 2026",



            submittedBy:

            "Juan Dela Cruz",



            category:

            "Retail Expansion Opportunity",



            aiAnalysis: {


                evaluated: true,


                score: 86,


                demographics: 88,


                traffic: 90,


                competitors: 78,


                accessibility: 91,


                lease: 83


            },



            businessProfile: {


                estimatedCustomers:

                "15,000+ daily visitors",



                marketSegment:

                "Urban commuters and residential customers",



                nearbyEstablishments: [

                    "SM Fairview",

                    "Transport Terminals",

                    "Residential Towers"

                ]

            },



            recommendation:

            "Strong location potential. Additional competitor analysis recommended before approval.",



            workflowStatus: {


                departmentReview:

                "Business Validation",


                legal:

                "Not Started",


                engineering:

                "Not Started",


                finance:

                "Not Started"

            }

        },





        /* ==================================================
           APPLICATION 3
        ================================================== */


        {

            id:

            "SP-2026-038",



            location:

            "Marikina Riverbanks",



            municipality:

            "Marikina City",



            status:

            "Needs Validation",



            submittedDate:

            "July 15, 2026",



            submittedBy:

            "Juan Dela Cruz",



            category:

            "Community Store Development",



            aiAnalysis: {


                evaluated: true,


                score: 74,


                demographics: 79,


                traffic: 70,


                competitors: 81,


                accessibility: 76,


                lease: 68


            },



            businessProfile: {


                estimatedCustomers:

                "6,000 - 8,000 daily visitors",



                marketSegment:

                "Local residents and weekend visitors",



                nearbyEstablishments: [

                    "Riverbanks Center",

                    "Schools",

                    "Public Transport"

                ]

            },



            recommendation:

            "Potential opportunity but requires additional traffic studies and lease evaluation.",



            workflowStatus: {


                departmentReview:

                "Needs Additional Data",


                legal:

                "Not Started",


                engineering:

                "Not Started",


                finance:

                "Not Started"

            }

        },





        /* ==================================================
           APPLICATION 4
        ================================================== */


        {

            id:

            "SP-2026-041",



            location:

            "Bocaue Town Center",



            municipality:

            "Bocaue, Bulacan",



            status:

            "Submitted",



            submittedDate:

            "July 16, 2026",



            submittedBy:

            "Juan Dela Cruz",



            category:

            "Franchise Expansion Site",



            aiAnalysis: {


                evaluated: true,


                score: 90,


                demographics: 92,


                traffic: 89,


                competitors: 86,


                accessibility: 94,


                lease: 87


            },



            businessProfile: {


                estimatedCustomers:

                "10,000 daily visitors",



                marketSegment:

                "Families, commuters, and nearby businesses",



                nearbyEstablishments: [

                    "Public Market",

                    "Highway Access",

                    "Commercial District"

                ]

            },



            recommendation:

            "Recommended for department evaluation. Strong accessibility and commercial growth indicators.",



            workflowStatus: {


                departmentReview:

                "Submitted",


                legal:

                "Pending",


                engineering:

                "Pending",


                finance:

                "Pending"

            }

        },

/* ======================================================
   SITE APPLICATION DATABASE
   PART 2

   Applications:
   SP-2026-044
   SP-2026-047
   SP-2026-051

====================================================== */



/* ==================================================
   APPLICATION 5
================================================== */


{

    id:

    "SP-2026-044",


    location:

    "Balagtas Public Market",


    municipality:

    "Balagtas, Bulacan",



    status:

    "Archived",



    submittedDate:

    "July 17, 2026",



    submittedBy:

    "Juan Dela Cruz",



    category:

    "Community Expansion Site",



    aiAnalysis: {


        evaluated: true,


        score: 63,


        demographics: 67,


        traffic: 61,


        competitors: 72,


        accessibility: 65,


        lease: 58


    },



    businessProfile: {


        estimatedCustomers:

        "3,000 - 5,000 daily visitors",



        marketSegment:

        "Local community shoppers",



        nearbyEstablishments: [

            "Balagtas Public Market",

            "Small Retail Stores",

            "Residential Areas"

        ]

    },



    recommendation:

    "Site archived due to limited growth potential and insufficient commercial traffic.",



    workflowStatus: {


        departmentReview:

        "Rejected",


        legal:

        "Cancelled",


        engineering:

        "Cancelled",


        finance:

        "Cancelled"

    }

},




/* ==================================================
   APPLICATION 6
================================================== */


{

    id:

    "SP-2026-047",



    location:

    "San Jose del Monte Highway",



    municipality:

    "San Jose del Monte, Bulacan",



    status:

    "Submitted",



    submittedDate:

    "July 18, 2026",



    submittedBy:

    "Juan Dela Cruz",



    category:

    "Highway Commercial Development",



    aiAnalysis: {


        evaluated: true,


        score: 88,


        demographics: 90,


        traffic: 93,


        competitors: 80,


        accessibility: 96,


        lease: 82


    },



    businessProfile: {


        estimatedCustomers:

        "11,000 - 14,000 daily visitors",



        marketSegment:

        "Commuters, families, and nearby subdivisions",



        nearbyEstablishments: [

            "Transport Terminals",

            "Residential Communities",

            "Commercial Plazas"

        ]

    },



    recommendation:

    "Excellent expansion opportunity due to increasing population density and transportation accessibility.",



    workflowStatus: {


        departmentReview:

        "Submitted",


        legal:

        "For Review",


        engineering:

        "For Review",


        finance:

        "For Review"

    }

},





/* ==================================================
   APPLICATION 7
================================================== */


{

    id:

    "SP-2026-051",



    location:

    "Meycauayan Junction",



    municipality:

    "Meycauayan, Bulacan",



    status:

    "Pending Review",



    submittedDate:

    "July 20, 2026",



    submittedBy:

    "Juan Dela Cruz",



    category:

    "Strategic Growth Area",



    aiAnalysis: {


        evaluated: false,


        score: null,


        demographics: null,


        traffic: null,


        competitors: null,


        accessibility: null,


        lease: null

    },



    businessProfile: {


        estimatedCustomers:

        "Pending AI Evaluation",



        marketSegment:

        "Commercial and residential market",



        nearbyEstablishments: [

            "Industrial Areas",

            "Residential Villages",

            "Main Highway"

        ]

    },



    recommendation:

    "Awaiting AI viability analysis.",



    workflowStatus: {

        departmentReview:
        "Pending Analysis",

        legal:
        "Not Started",

        engineering:
        "Not Started",

        finance:
        "Not Started"

    }

}

],


/* ======================================================
   ARCHIVED SITE RECORDS

   Displayed in Archived Sites Section

====================================================== */


archives: [

    {

        id:

        "SP-2026-044",

        location:

        "Balagtas Public Market",

        reason:

        "Low commercial growth indicators",

        archivedDate:

        "July 21, 2026",

        score:

        63

    },


    {

        id:

        "SP-2026-019",

        location:

        "Malolos Heritage District",

        reason:

        "High competitor density",

        archivedDate:

        "June 30, 2026",

        score:

        69

    },


    {

        id:

        "SP-2026-022",

        location:

        "Pulilan Town Center",

        reason:

        "Lease negotiation unsuccessful",

        archivedDate:

        "June 22, 2026",

        score:

        71

    }

],





/* ======================================================
   RECOMMENDATION DATA

   Used for Recommendation Screen

====================================================== */


recommendations: {


    highPotential: [

        {

            id:

            "SP-2026-027",

            reason:

            "Strong demographics and accessibility score"

        },


        {

            id:

            "SP-2026-047",

            reason:

            "High traffic and growing residential demand"

        }

    ],



    needsValidation: [

        {

            id:

            "SP-2026-038",

            reason:

            "Requires additional market research"

        },


        {

            id:

            "SP-2026-051",

            reason:

            "AI analysis pending"

        }

    ],



    rejected: [

        {

            id:

            "SP-2026-044",

            reason:

            "Insufficient commercial viability"

        }

    ]

},



/* ======================================================
   LOCATION INTELLIGENCE DATABASE

   Used for AI Analysis Display

====================================================== */


locationDatabase: {


    trafficIndicators: [

        "Vehicle Count",

        "Pedestrian Flow",

        "Public Transportation Access"

    ],



    demographicIndicators: [

        "Population Density",

        "Income Distribution",

        "Customer Age Groups"

    ],



    competitorIndicators: [

        "Nearby Franchise Stores",

        "Market Saturation",

        "Customer Alternatives"

    ],



    accessibilityIndicators: [

        "Highway Connectivity",

        "Parking Availability",

        "Public Access Points"

    ]

}

};




/* ======================================================
   END OF BUSINESS DEVELOPMENT DATA

====================================================== */