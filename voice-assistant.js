/* =========================================================
   AI WELFARE - VOICE ASSISTANT
   Complete Frontend JavaScript
========================================================= */

"use strict";

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = $(".page-loader");

    if (loader) {
        setTimeout(() => {
            loader.classList.add("hidden");
        }, 400);
    }

});


/* =========================================================
   SPEECH RECOGNITION SETUP
========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

let isListening = false;
let shouldRestart = false;

/* "auto" is what the language <select> defaults to, but the
   Web Speech API has no real auto-detect mode — it needs a
   concrete BCP-47 tag. We keep the UI value separate from
   the value actually sent to the recognizer. */
let selectedLanguage = "auto";
let currentLanguage = "en-IN";

const speechSupported = !!SpeechRecognition;

if (speechSupported) {

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.lang = "english"

} else {

    console.warn("Speech Recognition is not supported in this browser.");

}


/* =========================================================
   DOM ELEMENTS
   (IDs below match voice-assistant.html exactly)
========================================================= */

const micButton            = $("#micButton");
const assistantOrb         = $("#assistantOrb");
const micInstruction       = $("#micInstruction");
const statusDot            = $("#statusDot");
const assistantStatus      = $("#statusText");
const transcriptText       = $("#transcriptText");
const transcriptLanguage   = $("#transcriptLanguage");
const detectedLanguage     = $("#detectedLanguage");
const languageSelect       = $("#languageSelect");
const questionInput        = $("#questionInput");
const sendButton           = $("#sendButton");
const answerText           = $("#answerText");
const answerCard           = $("#answerCard");
const schemeContainer      = $("#schemesContainer");
const schemeCount          = $("#schemeCount");
const schemeSearch         = $("#schemeSearchInput");
const categoryFilter       = $("#schemeCategoryFilter");
const saveProfileButton    = $("#saveProfileButton");
const clearProfileButton   = $("#clearProfileButton");
const repeatButton         = $("#repeatButton");
const stopButton           = $("#stopButton");
const schemeModal          = $("#schemeDetailModal");
const schemeDetailContent  = $("#schemeDetailContent");
const modalClose           = $("#closeSchemeModal");


/* =========================================================
   DEFAULT PROFILE
========================================================= */

let userProfile = {
    age: "",
    gender: "",
    state: "",
    category: "",
    income: "",
    occupation: "",
    student: "no"
};

let lastAnswer = "";


/* =========================================================
   INCOME RANGE -> APPROX. UPPER BOUND (in ₹)
   The profile income field is a bracket ("2.5-5"), not a
   number, so we map it to a comparable ceiling value for
   matching against each scheme's maxIncome.
========================================================= */

const INCOME_BRACKETS = {
    "below-1": 100000,
    "1-2.5": 250000,
    "2.5-5": 500000,
    "5-10": 1000000,
    "above-10": 1500000
};


/* =========================================================
   GOVERNMENT SCHEME DATABASE
   Frontend demo data
========================================================= */

const schemes = [

    {
        id: 1,
        name: "PM-KISAN",
        category: "Farmers",
        state: "All India",
        maxIncome: 1000000,
        keywords: ["farmer", "agriculture", "kisan", "खेती", "किसान"],
        description: "Support-oriented government scheme for eligible farmer families.",
        benefits: [
            "Financial support for eligible farmer families.",
            "Useful for agricultural households.",
            "Application/status can be checked through the official portal."
        ],
        eligibility: [
            "Applicant should meet the applicable farmer eligibility conditions.",
            "Land and beneficiary records may be verified.",
            "Eligibility depends on current government rules."
        ],
        documents: ["Aadhaar", "Bank account details", "Land/farmer related records"],
        process: [
            "Open the official PM-KISAN portal.",
            "Complete the required registration/application process.",
            "Submit the required documents.",
            "Check application/beneficiary status."
        ],
        portal: "https://pmkisan.gov.in/"
    },

    {
        id: 2,
        name: "PMAY - Housing Support",
        category: "Housing",
        state: "All India",
        maxIncome: 500000,
        keywords: ["house", "home", "housing", "ghar", "मकान", "घर"],
        description: "Housing assistance for eligible households under applicable housing programmes.",
        benefits: [
            "Housing-related financial assistance may be available.",
            "Useful for eligible low-income households.",
            "Eligibility varies by programme and area."
        ],
        eligibility: [
            "Household must satisfy applicable housing criteria.",
            "Income and family information may be checked.",
            "Existing housing status may be considered."
        ],
        documents: ["Aadhaar", "Income certificate", "Address proof", "Bank details"],
        process: [
            "Check the applicable housing programme.",
            "Submit application through the official channel.",
            "Upload/submit required documents.",
            "Track application status."
        ],
        portal: "https://pmaymis.gov.in/"
    },

    {
        id: 3,
        name: "Post Matric Scholarship",
        category: "Education",
        state: "All India",
        maxIncome: 300000,
        keywords: ["student", "college", "education", "scholarship", "पढ़ाई", "छात्रवृत्ति"],
        description: "Scholarship support for eligible students according to applicable state/category rules.",
        benefits: [
            "Financial assistance for eligible education expenses.",
            "Useful for eligible post-matric students.",
            "Exact benefits depend on the applicable scholarship."
        ],
        eligibility: [
            "Applicant must satisfy the applicable student criteria.",
            "Income and category requirements may apply.",
            "Institution/course eligibility may also apply."
        ],
        documents: ["Aadhaar", "Income certificate", "Caste/category certificate if applicable", "Marksheet", "Bank account"],
        process: [
            "Visit the applicable scholarship portal.",
            "Register/login.",
            "Complete the scholarship form.",
            "Upload required documents.",
            "Submit and track verification."
        ],
        portal: "https://scholarships.gov.in/"
    },

    {
        id: 4,
        name: "Ayushman Bharat",
        category: "Health",
        state: "All India",
        maxIncome: 500000,
        keywords: ["health", "hospital", "medical", "treatment", "healthcare", "इलाज", "अस्पताल"],
        description: "Health coverage programme for eligible beneficiaries under applicable rules.",
        benefits: [
            "Health-care related coverage for eligible beneficiaries.",
            "Treatment may be available at empanelled facilities.",
            "Benefits depend on eligibility and current programme rules."
        ],
        eligibility: [
            "Eligibility is determined according to the applicable beneficiary database/rules.",
            "Beneficiary verification may be required."
        ],
        documents: ["Aadhaar/ID", "Beneficiary details", "Other documents as required"],
        process: [
            "Check beneficiary eligibility.",
            "Visit an authorised/empanelled facility.",
            "Complete beneficiary verification.",
            "Use the applicable health services."
        ],
        portal: "https://pmjay.gov.in/"
    },

    {
        id: 5,
        name: "Skill Development Support",
        category: "Employment",
        state: "All India",
        maxIncome: 600000,
        keywords: ["job", "skill", "employment", "training", "rojgar", "नौकरी", "रोजगार"],
        description: "Skill-development and training opportunities for eligible candidates.",
        benefits: [
            "Skill training opportunities.",
            "May improve employment readiness.",
            "Training availability depends on the programme."
        ],
        eligibility: [
            "Age and programme-specific requirements may apply.",
            "Candidate must satisfy the selected course criteria."
        ],
        documents: ["Aadhaar", "Education details", "Address proof", "Bank details if required"],
        process: [
            "Find an applicable training programme.",
            "Register on the official platform.",
            "Select an eligible course/centre.",
            "Complete verification."
        ],
        portal: "https://www.skillindia.gov.in/"
    },

    {
        id: 6,
        name: "Women Welfare Support",
        category: "Women",
        state: "All India",
        maxIncome: 500000,
        keywords: ["woman", "women", "female", "महिला", "नारी"],
        description: "Women-focused welfare opportunities available under applicable government programmes.",
        benefits: [
            "May provide support under applicable women welfare programmes.",
            "Benefits vary by programme."
        ],
        eligibility: [
            "Applicant must meet the selected programme criteria.",
            "Age, income and other conditions may apply."
        ],
        documents: ["Aadhaar", "Income certificate if required", "Bank details", "Address proof"],
        process: [
            "Identify the applicable programme.",
            "Read eligibility conditions.",
            "Apply through the official government channel.",
            "Track the application."
        ],
        portal: "https://wcd.gov.in/"
    }

];


/* =========================================================
   LANGUAGE HANDLING
========================================================= */

const LANGUAGE_NAMES = {
    "auto": "Auto Detect",
    "en-IN": "English",
    "hi-IN": "Hindi",
    "bn-IN": "Bengali",
    "as-IN": "Assamese",
    "gu-IN": "Gujarati",
    "mr-IN": "Marathi",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
    "kn-IN": "Kannada",
    "ml-IN": "Malayalam",
    "pa-IN": "Punjabi",
    "or-IN": "Odia",
    "ur-IN": "Urdu",
    "ne-IN": "Nepali",
    "sa-IN": "Sanskrit"
};

/* Fallback used whenever "auto" is selected, since the
   Web Speech API cannot truly auto-detect a language. */
const AUTO_DETECT_FALLBACK = "en-IN";

function resolveRecognitionLang(value) {
    if (!value || value === "auto") {
        return AUTO_DETECT_FALLBACK;
    }
    return value;
}

function getLanguageName(lang) {
    return LANGUAGE_NAMES[lang] || lang;
}

function updateLanguageUI() {

    if (transcriptLanguage) {
        transcriptLanguage.textContent = getLanguageName(currentLanguage);
    }

    if (detectedLanguage) {
        detectedLanguage.textContent =
            selectedLanguage === "auto"
                ? `Auto Detect (${getLanguageName(currentLanguage)})`
                : getLanguageName(currentLanguage);
    }

}

if (languageSelect) {

    languageSelect.addEventListener("change", () => {

        selectedLanguage = languageSelect.value || "auto";
        currentLanguage = resolveRecognitionLang(selectedLanguage);

        if (recognition) {
            recognition.lang = currentLanguage;
        }

        updateLanguageUI();

    });

}


/* =========================================================
   START / STOP MICROPHONE
========================================================= */

function startVoiceAssistant() {

    if (!speechSupported) {
        showAnswer("Voice recognition is not supported in this browser. Please use the text question box.");
        return;
    }

    if (isListening) {
        stopVoiceAssistant();
        return;
    }

    try {

        recognition.lang = currentLanguage;
        shouldRestart = false;
        recognition.start();

    } catch (error) {
        console.error("Microphone start error:", error);
    }

}

function stopVoiceAssistant() {

    shouldRestart = false;

    if (!recognition) return;

    try {
        recognition.stop();
    } catch (error) {
        console.warn(error);
    }

}

if (micButton) {
    micButton.addEventListener("click", startVoiceAssistant);
}


/* =========================================================
   RECOGNITION EVENT HANDLERS
========================================================= */

if (recognition) {

    recognition.onstart = () => {
        isListening = true;
        shouldRestart = true;
        updateListeningUI(true);
    };

    recognition.onresult = (event) => {

        let finalText = "";
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalText += transcript;
            } else {
                interimText += transcript;
            }

        }

        const displayText = finalText || interimText;

        if (transcriptText) {
            transcriptText.textContent = displayText;
        }

        if (finalText.trim()) {
            handleUserQuestion(finalText.trim());
        }

    };

    recognition.onerror = (event) => {

        isListening = false;
        updateListeningUI(false);

        if (event.error === "network") {
            showAnswer("Voice service network error aa raha hai. Aapka microphone detect ho raha hai, lekin browser speech-recognition service se connection nahi ban pa raha. Text question box se query try karein.");
            return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            showAnswer("Microphone permission allow nahi hai. Browser ke address bar me microphone permission Allow karein.");
            return;
        }

        if (event.error === "no-speech") {
            showAnswer("Mujhe speech clear nahi mili. Dobara microphone dabakar clearly boliye.");
            return;
        }

        if (event.error === "audio-capture") {
            showAnswer("Microphone access nahi mil raha. Windows microphone settings aur browser permission check karein.");
            return;
        }

        console.error("Speech recognition error:", event.error);

    };

    recognition.onend = () => {
        isListening = false;
        updateListeningUI(false);
    };

}


/* =========================================================
   LISTENING UI
========================================================= */

function updateListeningUI(active) {

    if (micButton) {
        micButton.classList.toggle("listening", active);
    }

    if (assistantOrb) {
        assistantOrb.classList.toggle("listening", active);
    }

    if (statusDot) {
        statusDot.classList.toggle("active", active);
    }

    if (assistantStatus) {
        assistantStatus.textContent = active ? "Listening..." : "Ready to listen.";
    }

    if (micInstruction) {
        micInstruction.textContent = active
            ? "Bolna start kijiye..."
            : "Click the microphone and start speaking.";
    }

}


/* =========================================================
   TEXT QUESTION INPUT
========================================================= */

if (sendButton) {

    sendButton.addEventListener("click", () => {

        const question = questionInput ? questionInput.value.trim() : "";

        if (!question) {
            showAnswer("Please apna question enter karein.");
            return;
        }

        handleUserQuestion(question);

    });

}

if (questionInput) {

    questionInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (sendButton) sendButton.click();
        }

    });

}


/* =========================================================
   QUICK QUESTIONS
========================================================= */

$$(".quick-question").forEach((button) => {

    button.addEventListener("click", () => {

        const question = button.dataset.question || button.textContent.trim();

        if (questionInput) {
            questionInput.value = question;
        }

        handleUserQuestion(question);

    });

});


/* =========================================================
   REPEAT / STOP SPEAKING
========================================================= */

if (repeatButton) {

    repeatButton.addEventListener("click", () => {
        if (lastAnswer) speakText(lastAnswer);
    });

}

if (stopButton) {

    stopButton.addEventListener("click", () => {
        stopSpeaking();
        stopVoiceAssistant();
    });

}


/* =========================================================
   MAIN QUESTION HANDLER
========================================================= */

function handleUserQuestion(question) {

    if (!question) return;

    if (transcriptText) {
        transcriptText.textContent = question;
    }

    const matchedSchemes = findMatchingSchemes(question);
    const response = generateAssistantResponse(question, matchedSchemes);

    showAnswer(response);
    renderSchemes(matchedSchemes);
    speakText(response);

}


/* =========================================================
   FIND MATCHING SCHEMES
========================================================= */

function findMatchingSchemes(question) {

    const text = question.toLowerCase();
    const profile = userProfile;

    const results = schemes.map((scheme) => {

        let score = 0;

        /* Keyword matching */
        scheme.keywords.forEach((keyword) => {
            if (text.includes(keyword.toLowerCase())) {
                score += 25;
            }
        });

        /* Category matching */
        if (profile.category && scheme.category.toLowerCase().includes(profile.category.toLowerCase())) {
            score += 15;
        }

        /* Student */
        if (profile.student === "yes" && scheme.category === "Education") {
            score += 35;
        }

        /* Occupation - farmer */
        if (profile.occupation === "farmer" && scheme.category === "Farmers") {
            score += 35;
        }

        /* Gender */
        if (profile.gender === "female" && scheme.category === "Women") {
            score += 35;
        }

        /* Income (mapped bracket -> approx ceiling) */
        if (profile.income && INCOME_BRACKETS[profile.income] !== undefined) {

            const income = INCOME_BRACKETS[profile.income];

            if (income <= scheme.maxIncome) {
                score += 10;
            }

        }

        return { ...scheme, score: Math.min(score, 99) };

    });

    let filtered = results
        .filter(scheme => scheme.score > 0)
        .sort((a, b) => b.score - a.score);

    /* If no keyword match, fall back to profile-only matching */
    if (
        filtered.length === 0 &&
        (profile.student === "yes" || profile.category || profile.occupation || profile.income)
    ) {

        filtered = results
            .filter(scheme => scheme.score >= 10)
            .sort((a, b) => b.score - a.score);

    }

    return filtered;

}


/* =========================================================
   ASSISTANT RESPONSE
========================================================= */

function generateAssistantResponse(question, matchedSchemes) {

    const text = question.toLowerCase();

    if (text.includes("hello") || text.includes("hi") || text.includes("namaste") || text.includes("नमस्ते")) {
        return "Namaste! Main AI Welfare Assistant hoon. Aap government welfare schemes, scholarship, housing, health, farmer aur employment schemes ke baare mein pooch sakte hain.";
    }

    if (text.includes("scholarship") || text.includes("छात्रवृत्ति") || text.includes("student")) {
        return "Aapke question ke liye Education category ki schemes check ki gayi hain. Eligibility income, category, course aur institution ke rules par depend karti hai. Neeche matching schemes dekhiye.";
    }

    if (text.includes("farmer") || text.includes("kisan") || text.includes("किसान") || text.includes("खेती")) {
        return "Farmer-related welfare schemes search ki gayi hain. Neeche matching schemes dekhiye. Final eligibility official government portal par verify karein.";
    }

    if (text.includes("house") || text.includes("home") || text.includes("ghar") || text.includes("मकान") || text.includes("घर")) {
        return "Housing related schemes search ki gayi hain. Income, family aur existing housing conditions ke basis par eligibility check hoti hai.";
    }

    if (text.includes("health") || text.includes("hospital") || text.includes("medical") || text.includes("इलाज") || text.includes("अस्पताल")) {
        return "Health welfare schemes search ki gayi hain. Aapki beneficiary eligibility official system par verify karna zaroori hai.";
    }

    if (text.includes("job") || text.includes("employment") || text.includes("skill") || text.includes("rojgar") || text.includes("नौकरी") || text.includes("रोजगार")) {
        return "Employment aur skill-development related schemes search ki gayi hain. Neeche matching opportunities dekhiye.";
    }

    if (matchedSchemes.length === 0) {
        return "Mujhe is question ke liye direct matching scheme nahi mili. Aap apni age, state, income, category, student status ya requirement batakar dobara try karein.";
    }

    return `${matchedSchemes.length} matching government scheme${matchedSchemes.length > 1 ? "s" : ""} mili hain. Neeche results dekhiye. Final eligibility official portal par verify karein.`;

}


/* =========================================================
   SHOW ANSWER
========================================================= */

function showAnswer(message) {

    lastAnswer = message;

    if (answerText) {
        answerText.textContent = message;
    }

    if (answerCard) {
        answerCard.style.display = "flex";
    }

}


/* =========================================================
   TEXT TO SPEECH
========================================================= */

function speakText(text) {

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = currentLanguage;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);

}

function stopSpeaking() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
}


/* =========================================================
   SCHEME RENDER
========================================================= */

function renderSchemes(schemeList) {

    if (!schemeContainer) return;

    schemeContainer.innerHTML = "";

    if (schemeCount) {
        schemeCount.textContent = schemeList.length;
    }

    if (schemeList.length === 0) {

        schemeContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="bi bi-search"></i>
                </div>
                <h3>No Matching Schemes</h3>
                <p>Try another question or update your profile information.</p>
            </div>
        `;

        return;

    }

    schemeList.forEach((scheme) => {
        schemeContainer.appendChild(createSchemeCard(scheme));
    });

}


/* =========================================================
   CREATE SCHEME CARD
   (Icons use Bootstrap Icons — the only icon library
   actually loaded on the page.)
========================================================= */

function createSchemeCard(scheme) {

    const card = document.createElement("article");
    card.className = "scheme-card";

    const score = scheme.score || 0;

    card.innerHTML = `

        <div class="scheme-top">
            <div>
                <div class="scheme-name">${escapeHTML(scheme.name)}</div>
                <span class="scheme-category">${escapeHTML(scheme.category)}</span>
            </div>
            <span class="match-badge">${score}% Match</span>
        </div>

        <div class="match-reason">
            <strong>Why this may match:</strong>
            ${escapeHTML(getMatchReason(scheme))}
        </div>

        <div class="scheme-section">
            <h3><i class="bi bi-gift-fill"></i> Benefits</h3>
            <ul class="scheme-list">
                ${scheme.benefits.map(item => `
                    <li><i class="bi bi-check-lg"></i><span>${escapeHTML(item)}</span></li>
                `).join("")}
            </ul>
        </div>

        <div class="scheme-section">
            <h3><i class="bi bi-person-check-fill"></i> Eligibility</h3>
            <ul class="scheme-list">
                ${scheme.eligibility.map(item => `
                    <li><i class="bi bi-check-circle-fill"></i><span>${escapeHTML(item)}</span></li>
                `).join("")}
            </ul>
        </div>

        <div class="scheme-section">
            <h3><i class="bi bi-list-ol"></i> Application Process</h3>
            <ul class="process-list">
                ${scheme.process.map((item, index) => `
                    <li>
                        <span class="step-number">${index + 1}</span>
                        <span>${escapeHTML(item)}</span>
                    </li>
                `).join("")}
            </ul>
        </div>

        <button type="button" class="portal-button" data-scheme-id="${scheme.id}">
            <i class="bi bi-box-arrow-up-right"></i>
            Official Portal
        </button>

        <button type="button" class="control-button scheme-details-button" data-scheme-id="${scheme.id}" style="width:100%;margin-top:8px;">
            <i class="bi bi-info-circle-fill"></i>
            View Full Details
        </button>

    `;

    const portalButton = card.querySelector(".portal-button");

    if (portalButton) {
        portalButton.addEventListener("click", () => {
            window.open(scheme.portal, "_blank", "noopener,noreferrer");
        });
    }

    const detailsButton = card.querySelector(".scheme-details-button");

    if (detailsButton) {
        detailsButton.addEventListener("click", () => {
            openSchemeModal(scheme);
        });
    }

    return card;

}


/* =========================================================
   MATCH REASON
========================================================= */

function getMatchReason(scheme) {

    if (scheme.score >= 70) {
        return "Your question/profile has strong matching signals for this category.";
    }

    if (scheme.score >= 40) {
        return "Your question/profile has some relevant information for this scheme.";
    }

    return "This scheme may be relevant based on the information provided.";

}


/* =========================================================
   SCHEME DETAIL MODAL
========================================================= */

function openSchemeModal(scheme) {

    if (!schemeModal || !schemeDetailContent) return;

    schemeDetailContent.innerHTML = `

        <h2>${escapeHTML(scheme.name)}</h2>
        <p>${escapeHTML(scheme.description)}</p>

        <h3>Benefits</h3>
        <ul>${scheme.benefits.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>

        <h3>Eligibility</h3>
        <ul>${scheme.eligibility.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>

        <h3>Required Documents</h3>
        <ul>${scheme.documents.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>

        <h3>Application Process</h3>
        <ul>${scheme.process.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>

        <button type="button" class="portal-button" id="modalPortalButton">
            <i class="bi bi-box-arrow-up-right"></i>
            Open Official Portal
        </button>

    `;

    schemeModal.classList.add("show");
    schemeModal.setAttribute("aria-hidden", "false");

    const modalPortalButton = $("#modalPortalButton");

    if (modalPortalButton) {
        modalPortalButton.addEventListener("click", () => {
            window.open(scheme.portal, "_blank", "noopener,noreferrer");
        });
    }

}

function closeSchemeModal() {

    if (schemeModal) {
        schemeModal.classList.remove("show");
        schemeModal.setAttribute("aria-hidden", "true");
    }

}

if (modalClose) {
    modalClose.addEventListener("click", closeSchemeModal);
}

if (schemeModal) {
    schemeModal.addEventListener("click", (event) => {
        if (event.target === schemeModal) {
            closeSchemeModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSchemeModal();
    }
});


/* =========================================================
   SEARCH / FILTER SCHEMES
========================================================= */

function filterSchemes() {

    const search = schemeSearch ? schemeSearch.value.trim().toLowerCase() : "";
    const category = categoryFilter ? categoryFilter.value : "";

    const filtered = schemes
        .map(scheme => ({ ...scheme, score: scheme.score || 0 }))
        .filter((scheme) => {

            const matchesSearch =
                !search ||
                scheme.name.toLowerCase().includes(search) ||
                scheme.category.toLowerCase().includes(search) ||
                scheme.description.toLowerCase().includes(search);

            const matchesCategory = !category || scheme.category === category;

            return matchesSearch && matchesCategory;

        });

    renderSchemes(filtered);

}

if (schemeSearch) {
    schemeSearch.addEventListener("input", filterSchemes);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterSchemes);
}


/* =========================================================
   PROFILE
   (IDs match the actual profile fields in the HTML:
   userAge, userState, userOccupation, userIncome,
   userCategory, userGender. "student" is derived from
   the occupation dropdown rather than a separate field.)
========================================================= */

function readProfileFromHTML() {

    const getValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    };

    const occupation = getValue("userOccupation");

    userProfile = {
        age: getValue("userAge"),
        gender: getValue("userGender"),
        state: getValue("userState"),
        category: getValue("userCategory"),
        income: getValue("userIncome"),
        occupation: occupation,
        student: occupation === "student" ? "yes" : "no"
    };

    return userProfile;

}

if (saveProfileButton) {

    saveProfileButton.addEventListener("click", () => {

        readProfileFromHTML();

        try {
            localStorage.setItem("aiWelfareProfile", JSON.stringify(userProfile));
        } catch (error) {
            console.error("Profile save error:", error);
        }

        showAnswer("Profile successfully save ho gaya. Ab aapki welfare scheme recommendations profile ke basis par better match hongi.");

        renderSchemes(findMatchingSchemes(""));

    });

}

function loadProfile() {

    let saved;

    try {
        saved = localStorage.getItem("aiWelfareProfile");
    } catch (error) {
        console.error("Profile load error:", error);
        return;
    }

    if (!saved) return;

    try {

        userProfile = JSON.parse(saved);

        setInputValue("userAge", userProfile.age);
        setInputValue("userGender", userProfile.gender);
        setInputValue("userState", userProfile.state);
        setInputValue("userCategory", userProfile.category);
        setInputValue("userIncome", userProfile.income);
        setInputValue("userOccupation", userProfile.occupation);

    } catch (error) {
        console.error("Profile parse error:", error);
    }

}

function setInputValue(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.value = value || "";
    }

}

if (clearProfileButton) {

    clearProfileButton.addEventListener("click", () => {

        try {
            localStorage.removeItem("aiWelfareProfile");
        } catch (error) {
            console.error("Profile clear error:", error);
        }

        userProfile = {
            age: "",
            gender: "",
            state: "",
            category: "",
            income: "",
            occupation: "",
            student: "no"
        };

        ["userAge", "userState", "userOccupation", "userIncome", "userCategory", "userGender"]
            .forEach(id => setInputValue(id, ""));

        showAnswer("Profile clear ho gaya.");

    });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

    updateLanguageUI();

    updateListeningUI(false);

    setupFloatingVoiceAssistant();

    console.log("✅ AI Welfare Voice Assistant Loaded");

    console.log(
        "Speech Recognition:",
        speechSupported
            ? "SUPPORTED"
            : "NOT SUPPORTED"
    );

    console.log(
        "🎤 Floating Voice Assistant Ready"
    );

});

/* =========================================================
   GLOBAL DEBUG ACCESS
========================================================= */

window.AIWelfare = {
    startVoiceAssistant,
    stopVoiceAssistant,
    stopSpeaking,
    findMatchingSchemes,
    renderSchemes,
    schemes,
    getProfile: () => userProfile
};

/* =====================================================
   FLOATING VOICE ASSISTANT
===================================================== */

function setupFloatingVoiceAssistant() {

    const floatingButton =
        document.getElementById("floatingMicButton");

    const floatingStatus =
        document.getElementById("floatingVoiceStatus");

    if (!floatingButton) {
        console.warn(
            "Floating microphone button not found."
        );

        return;
    }

    floatingButton.addEventListener(
        "click",
        function () {

            console.log(
                "🎤 Floating microphone clicked"
            );

            // Use existing microphone button
            const mainMicButton =
                document.getElementById("micButton");

            if (mainMicButton) {

                mainMicButton.click();

                return;
            }

            // Fallback
            if (
                typeof startListening ===
                "function"
            ) {

                startListening();

            } else {

                console.warn(
                    "startListening() function not found."
                );
            }

        }
    );
}