/* =========================================================
   AI WELFARE
   ELIGIBILITY CHECKER
   PROFESSIONAL JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("AI Welfare Eligibility Page Loaded Successfully");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuButton =
        document.getElementById("eligibilityMenuBtn");

    const navigation =
        document.getElementById("eligibilityNavMenu");

    const form =
        document.getElementById("eligibilityPreviewForm");

    const message =
        document.getElementById("eligibilityMessage");

    const result =
        document.getElementById("eligibilityResult");


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function () {

            navigation.classList.toggle("show");

            const isOpen =
                navigation.classList.contains("show");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );


            const icon =
                menuButton.querySelector("i");

            if (icon) {

                if (isOpen) {

                    icon.className = "bi bi-x-lg";

                } else {

                    icon.className = "bi bi-list";

                }

            }

        });


        /* Close menu after clicking a link */

        const navLinks =
            navigation.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("show");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuButton.querySelector("i");

                if (icon) {
                    icon.className = "bi bi-list";
                }

            });

        });

    }


    /* =====================================================
       FORM CHECK
    ===================================================== */

    if (!form) {

        console.error(
            "Eligibility form not found: #eligibilityPreviewForm"
        );

        return;
    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log(
            "Check My Eligibility button clicked"
        );


        /* =================================================
           GET FORM ELEMENTS
        ================================================= */

        const ageElement =
            document.getElementById("age");

        const incomeElement =
            document.getElementById("income");

        const occupationElement =
            document.getElementById("occupation");

        const familyMembersElement =
            document.getElementById("familyMembers");

        const stateElement =
            document.getElementById("state");

        const residenceElement =
            document.getElementById("residenceType");

        const categoryElement =
            document.getElementById("socialCategory");

        const disabilityElement =
            document.getElementById("disabilityStatus");


        /* =================================================
           CHECK FORM ELEMENTS
        ================================================= */

        if (
            !ageElement ||
            !incomeElement ||
            !occupationElement ||
            !familyMembersElement ||
            !stateElement ||
            !residenceElement ||
            !categoryElement ||
            !disabilityElement
        ) {

            console.error(
                "One or more eligibility form fields are missing."
            );

            showMessage(
                "Form configuration error. Please check the form fields.",
                "error"
            );

            return;
        }


        /* =================================================
           GET VALUES
        ================================================= */

        const age =
            ageElement.value.trim();

        const income =
            incomeElement.value.trim();

        const occupation =
            occupationElement.value;

        const familyMembers =
            familyMembersElement.value.trim();

        const state =
            stateElement.value;

        const residenceType =
            residenceElement.value;

        const socialCategory =
            categoryElement.value;

        const disabilityStatus =
            disabilityElement.value;


        /* =================================================
           REQUIRED FIELD VALIDATION
        ================================================= */

        if (
            age === "" ||
            income === "" ||
            occupation === "" ||
            familyMembers === "" ||
            state === "" ||
            residenceType === "" ||
            socialCategory === "" ||
            disabilityStatus === ""
        ) {

            showMessage(
                "Please complete all required fields before checking eligibility.",
                "error"
            );

            hideResult();

            return;
        }


        /* =================================================
           AGE VALIDATION
        ================================================= */

        const ageNumber =
            Number(age);

        if (
            !Number.isFinite(ageNumber) ||
            ageNumber < 1 ||
            ageNumber > 120
        ) {

            showMessage(
                "Please enter a valid age between 1 and 120.",
                "error"
            );

            hideResult();

            ageElement.focus();

            return;
        }


        /* =================================================
           INCOME VALIDATION
        ================================================= */

        const incomeNumber =
            Number(income);

        if (
            !Number.isFinite(incomeNumber) ||
            incomeNumber < 0
        ) {

            showMessage(
                "Please enter a valid annual family income.",
                "error"
            );

            hideResult();

            incomeElement.focus();

            return;
        }


        /* =================================================
           FAMILY MEMBER VALIDATION
        ================================================= */

        const familyNumber =
            Number(familyMembers);

        if (
            !Number.isFinite(familyNumber) ||
            familyNumber < 1 ||
            familyNumber > 50
        ) {

            showMessage(
                "Family members must be between 1 and 50.",
                "error"
            );

            hideResult();

            familyMembersElement.focus();

            return;
        }


        /* =================================================
           SHOW LOADING STATE
        ================================================= */

        const submitButton =
            form.querySelector(
                ".check-eligibility-btn"
            );

        const originalButtonHTML =
            submitButton
                ? submitButton.innerHTML
                : "";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML = `
                <i class="bi bi-arrow-repeat"></i>
                <span>Analyzing Profile...</span>
            `;

        }


        /* =================================================
           SIMULATE AI ANALYSIS
        ================================================= */

        setTimeout(function () {


            /* =============================================
               RESTORE BUTTON
            ============================================== */

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonHTML;

            }


        
/* =====================================================
   RUN ELIGIBILITY ANALYSIS
===================================================== */

const analysis = analyzeEligibility({

    age: ageNumber,

    income: incomeNumber,

    occupation: occupation,

    familyMembers: familyNumber,

    state: state,

    residenceType: residenceType,

    socialCategory: socialCategory,

    disabilityStatus: disabilityStatus

});


/* =====================================================
   DISPLAY FINAL RESULT
===================================================== */

showEligibilityResult(analysis);

showResult();

            /* =============================================
               STORE PROFILE LOCALLY
            ============================================== */

            const eligibilityProfile = {

                age: ageNumber,

                income: incomeNumber,

                occupation: occupation,

                familyMembers: familyNumber,

                state: state,

                residenceType: residenceType,

                socialCategory: socialCategory,

                disabilityStatus: disabilityStatus,

                submittedAt:
                    new Date().toISOString()

            };


            try {

                localStorage.setItem(
                    "aiWelfareEligibilityProfile",
                    JSON.stringify(
                        eligibilityProfile
                    )
                );

            } catch (error) {

                console.warn(
                    "Unable to save profile to localStorage.",
                    error
                );

            }


            /* =============================================
               CONSOLE
            ============================================== */

            console.log(
                "Eligibility Profile:",
                eligibilityProfile
            );


            /* =============================================
               SCROLL TO RESULT
            ============================================== */

            if (result) {

                setTimeout(function () {

                    result.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 150);

            }

        }, 900);

    });


    /* =====================================================
       MESSAGE FUNCTION
    ===================================================== */

    function showMessage(text, type) {

        if (!message) {
            return;
        }


        message.style.display = "block";


        if (type === "success") {

            message.style.background =
                "#ecfdf5";

            message.style.color =
                "#166534";

            message.style.border =
                "1px solid #bbf7d0";

        } else {

            message.style.background =
                "#fef2f2";

            message.style.color =
                "#b91c1c";

            message.style.border =
                "1px solid #fecaca";

        }


        message.textContent = text;

    }


    /* =====================================================
       HIDE RESULT
    ===================================================== */

    function hideResult() {

        if (!result) {
            return;
        }

        result.style.display = "none";

        result.classList.remove("show");

    }


    /* =====================================================
       SHOW RESULT
    ===================================================== */

    function showResult() {

        if (!result) {
            return;
        }

        result.style.display = "flex";

        result.classList.add("show");

    }


    /* =====================================================
       INPUT VALIDATION
    ===================================================== */

    const numericInputs =
        form.querySelectorAll(
            'input[type="number"]'
        );


    numericInputs.forEach(function (input) {

        input.addEventListener(
            "input",
            function () {

                if (Number(this.value) < 0) {

                    this.value = 0;

                }

            }
        );

    });


    /* =====================================================
       PREVENT NEGATIVE FAMILY MEMBERS
    ===================================================== */

    const familyInput =
        document.getElementById(
            "familyMembers"
        );

    if (familyInput) {

        familyInput.addEventListener(
            "input",
            function () {

                if (Number(this.value) < 1) {

                    if (this.value !== "") {
                        this.value = 1;
                    }

                }

            }
        );

    }


    /* =====================================================
       CLEAR ERROR WHEN USER CHANGES INPUT
    ===================================================== */

    const formControls =
        form.querySelectorAll(
            "input, select"
        );


    formControls.forEach(function (control) {

        control.addEventListener(
            "change",
            function () {

                if (message) {

                    message.style.display =
                        "none";

                }

            }
        );


        control.addEventListener(
            "input",
            function () {

                if (message) {

                    message.style.display =
                        "none";

                }

            }
        );

    });


    /* =====================================================
       LOAD PREVIOUS PROFILE
    ===================================================== */

    try {

        const savedProfile =
            localStorage.getItem(
                "aiWelfareEligibilityProfile"
            );


        if (savedProfile) {

            const profile =
                JSON.parse(savedProfile);


            console.log(
                "Previous eligibility profile found:",
                profile
            );

        }

    } catch (error) {

        console.warn(
            "Unable to read saved eligibility profile.",
            error
        );

    }


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    form.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                event.target.tagName !== "SELECT"
            ) {

                /*
                 * Allow normal form submission
                 * through keyboard.
                 */

            }

        }
    );


});
/* =========================================================
   AI WELFARE - ELIGIBILITY RULE ENGINE
========================================================= */

function analyzeEligibility(profile) {

    const age = Number(profile.age);
    const income = Number(profile.income);
    const familyMembers = Number(profile.familyMembers);

    const occupation = String(profile.occupation).toLowerCase();
    const state = String(profile.state).toLowerCase();
    const category = String(profile.socialCategory).toLowerCase();
    const disability = String(profile.disabilityStatus).toLowerCase();


    const schemes = [];


    /* =====================================================
       PM-KISAN - DEMO RULE
    ===================================================== */

    if (
        occupation.includes("farmer") ||
        occupation.includes("agriculture")
    ) {

        schemes.push({
            name: "PM-KISAN Samman Nidhi",
            category: "Agriculture",
            reason: "Your occupation matches the agriculture/farmer profile."
        });

    }


    /* =====================================================
       SCHOLARSHIP - DEMO RULE
    ===================================================== */

    if (
        age >= 16 &&
        age <= 35 &&
        (
            category.includes("sc") ||
            category.includes("st") ||
            category.includes("obc") ||
            category.includes("student")
        )
    ) {

        schemes.push({
            name: "National Scholarship Portal",
            category: "Education",
            reason: "Your age and social/student profile may match scholarship criteria."
        });

    }


    /* =====================================================
       AYUSHMAN BHARAT - DEMO RULE
    ===================================================== */

    if (
        income <= 300000 ||
        familyMembers >= 5
    ) {

        schemes.push({
            name: "Ayushman Bharat",
            category: "Healthcare",
            reason: "Your income/family profile may qualify for healthcare support."
        });

    }


    /* =====================================================
       DISABILITY SUPPORT - DEMO RULE
    ===================================================== */

    if (
        !disability.includes("no") &&
        !disability.includes("none") &&
        !disability.includes("without")
    ) {

        schemes.push({
            name: "Disability Welfare Support",
            category: "Social Welfare",
            reason: "Your disability status indicates possible eligibility for disability support."
        });

    }


    /* =====================================================
       LOW INCOME FAMILY SUPPORT
    ===================================================== */

    if (income <= 200000) {

        schemes.push({
            name: "Low Income Family Welfare Support",
            category: "Social Welfare",
            reason: "Your annual family income falls within the demo low-income threshold."
        });

    }


    /* =====================================================
       GENERAL ELIGIBILITY
    ===================================================== */

    let eligible = schemes.length > 0;


    /* =====================================================
       RESULT
    ===================================================== */

    return {

        eligible: eligible,

        schemeCount: schemes.length,

        schemes: schemes,

        message: eligible
            ? "Based on the information provided, you may be eligible for one or more welfare schemes."
            : "Based on the current demo rules, no matching scheme was found for your profile."

    };

}
/* =========================================================
   DISPLAY ELIGIBILITY RESULT
========================================================= */

function showEligibilityResult(analysis) {

    const result =
        document.getElementById("eligibilityResult");

    if (!result) {
        return;
    }


    if (analysis.eligible) {

        result.innerHTML = `

            <div class="eligibility-result-icon success-icon">
                <i class="bi bi-check-circle-fill"></i>
            </div>

            <div class="eligibility-result-content">

                <span class="result-label success-label">
                    ELIGIBILITY RESULT
                </span>

                <h2>
                    You May Be Eligible
                </h2>

                <p>
                    ${analysis.message}
                </p>

                <div class="matched-schemes">

                    <h3>
                        ${analysis.schemeCount}
                        Matching Scheme(s) Found
                    </h3>

                    ${analysis.schemes.map(function (scheme) {

                        return `

                            <div class="matched-scheme-card">

                                <div class="scheme-check">
                                    <i class="bi bi-check-lg"></i>
                                </div>

                                <div>

                                    <h4>
                                        ${scheme.name}
                                    </h4>

                                    <span>
                                        ${scheme.category}
                                    </span>

                                    <p>
                                        ${scheme.reason}
                                    </p>

                                </div>

                            </div>

                        `;

                    }).join("")}

                </div>

                <div class="result-disclaimer">

                    <i class="bi bi-info-circle"></i>

                    <span>
                        This is a preliminary recommendation.
                        Final eligibility depends on official
                        government rules and document verification.
                    </span>

                </div>

            </div>
        `;


    } else {

        result.innerHTML = `

            <div class="eligibility-result-icon warning-icon">
                <i class="bi bi-exclamation-circle-fill"></i>
            </div>

            <div class="eligibility-result-content">

                <span class="result-label warning-label">
                    ELIGIBILITY RESULT
                </span>

                <h2>
                    No Matching Scheme Found
                </h2>

                <p>
                    ${analysis.message}
                </p>

                <div class="result-disclaimer">

                    <i class="bi bi-info-circle"></i>

                    <span>
                        You may still qualify for schemes not
                        included in this demo rule engine.
                        Final eligibility is determined by the
                        concerned government authority.
                    </span>

                </div>

            </div>
        `;

    }


    result.style.display = "flex";

    result.classList.add("show");

}