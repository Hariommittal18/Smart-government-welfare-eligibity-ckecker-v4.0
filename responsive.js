/* =========================================================
   AI WELFARE - RESPONSIVE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("AI Welfare Responsive JS Loaded Successfully");

    initializeResponsiveNavigation();

    initializeResponsiveDropdowns();

    initializeResponsiveTables();

    initializeResponsiveForms();

    initializeResponsiveCards();

    initializeResponsiveViewport();

});


/* =========================================================
   RESPONSIVE NAVIGATION
========================================================= */

function initializeResponsiveNavigation() {

    const navbar =
        document.querySelector(".navbar");


    if (!navbar) {
        return;
    }


    const toggler =
        navbar.querySelector(".navbar-toggler");


    const collapse =
        navbar.querySelector(".navbar-collapse");


    const navLinks =
        navbar.querySelectorAll(".nav-link");


    if (!toggler || !collapse) {
        return;
    }


    /* -----------------------------------------------------
       CLOSE MENU AFTER CLICK
    ----------------------------------------------------- */

    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth < 992 &&
                    collapse.classList.contains("show")
                ) {

                    toggler.click();

                }

            }
        );

    });


    /* -----------------------------------------------------
       CLOSE MENU WHEN CLICKING OUTSIDE
    ----------------------------------------------------- */

    document.addEventListener(
        "click",
        function (event) {

            const clickedInsideNavbar =
                navbar.contains(event.target);


            if (
                !clickedInsideNavbar &&
                collapse.classList.contains("show") &&
                window.innerWidth < 992
            ) {

                toggler.click();

            }

        }
    );

}


/* =========================================================
   RESPONSIVE DROPDOWNS
========================================================= */

function initializeResponsiveDropdowns() {

    const dropdowns =
        document.querySelectorAll(".dropdown");


    if (!dropdowns.length) {
        return;
    }


    dropdowns.forEach(function (dropdown) {

        const menu =
            dropdown.querySelector(".dropdown-menu");


        const button =
            dropdown.querySelector(".dropdown-toggle");


        if (!menu || !button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                if (window.innerWidth < 992) {

                    menu.classList.toggle("show");

                }

            }
        );

    });

}


/* =========================================================
   RESPONSIVE TABLES
========================================================= */

function initializeResponsiveTables() {

    const tables =
        document.querySelectorAll("table");


    if (!tables.length) {
        return;
    }


    tables.forEach(function (table) {

        /* Avoid duplicate wrapper */

        if (
            table.parentElement &&
            table.parentElement.classList.contains(
                "responsive-table-wrapper"
            )
        ) {

            return;

        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "responsive-table-wrapper";


        wrapper.style.width =
            "100%";


        wrapper.style.overflowX =
            "auto";


        wrapper.style.webkitOverflowScrolling =
            "touch";


        wrapper.style.borderRadius =
            "12px";


        table.parentNode.insertBefore(
            wrapper,
            table
        );


        wrapper.appendChild(table);

    });

}


/* =========================================================
   RESPONSIVE FORMS
========================================================= */

function initializeResponsiveForms() {

    const forms =
        document.querySelectorAll("form");


    if (!forms.length) {
        return;
    }


    forms.forEach(function (form) {

        const inputs =
            form.querySelectorAll(
                "input, select, textarea"
            );


        inputs.forEach(function (input) {

            input.addEventListener(
                "focus",
                function () {

                    if (
                        window.innerWidth <= 576
                    ) {

                        setTimeout(
                            function () {

                                input.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center"
                                });

                            },
                            250
                        );

                    }

                }
            );

        });

    });

}


/* =========================================================
   RESPONSIVE CARDS
========================================================= */

function initializeResponsiveCards() {

    const cards =
        document.querySelectorAll(
            ".feature-card, " +
            ".scheme-card, " +
            ".process-card, " +
            ".mission-card, " +
            ".feature-box, " +
            ".dashboard-card"
        );


    if (!cards.length) {
        return;
    }


    function updateCards() {

        cards.forEach(function (card) {

            if (
                window.innerWidth <= 576
            ) {

                card.style.minHeight =
                    "auto";

            }

            else {

                card.style.minHeight =
                    "";

            }

        });

    }


    updateCards();


    window.addEventListener(
        "resize",
        debounce(
            updateCards,
            150
        )
    );

}


/* =========================================================
   RESPONSIVE VIEWPORT
========================================================= */

function initializeResponsiveViewport() {

    function updateViewportClass() {

        const width =
            window.innerWidth;


        document.body.classList.remove(
            "viewport-mobile",
            "viewport-tablet",
            "viewport-desktop"
        );


        if (width <= 576) {

            document.body.classList.add(
                "viewport-mobile"
            );

        }

        else if (width <= 991) {

            document.body.classList.add(
                "viewport-tablet"
            );

        }

        else {

            document.body.classList.add(
                "viewport-desktop"
            );

        }

    }


    updateViewportClass();


    window.addEventListener(
        "resize",
        debounce(
            updateViewportClass,
            150
        )
    );

}


/* =========================================================
   MOBILE HERO IMAGE
========================================================= */

function initializeResponsiveHero() {

    const heroImages =
        document.querySelectorAll(
            ".hero-image"
        );


    if (!heroImages.length) {
        return;
    }


    function updateHeroImages() {

        heroImages.forEach(
            function (image) {

                if (
                    window.innerWidth <= 576
                ) {

                    image.style.maxWidth =
                        "280px";

                }

                else if (
                    window.innerWidth <= 991
                ) {

                    image.style.maxWidth =
                        "350px";

                }

                else {

                    image.style.maxWidth =
                        "";

                }

            }
        );

    }


    updateHeroImages();


    window.addEventListener(
        "resize",
        debounce(
            updateHeroImages,
            150
        )
    );

}


/* =========================================================
   RESPONSIVE BUTTONS
========================================================= */

function initializeResponsiveButtons() {

    const buttonGroups =
        document.querySelectorAll(
            ".hero-buttons, " +
            ".cta-buttons, " +
            ".about-hero-buttons"
        );


    if (!buttonGroups.length) {
        return;
    }


    function updateButtons() {

        buttonGroups.forEach(
            function (group) {

                const buttons =
                    group.querySelectorAll(
                        ".btn, " +
                        "a, " +
                        "button"
                    );


                if (
                    window.innerWidth <= 576
                ) {

                    group.style.flexDirection =
                        "column";


                    group.style.alignItems =
                        "stretch";


                    buttons.forEach(
                        function (button) {

                            button.style.width =
                                "100%";

                            button.style.marginRight =
                                "0";

                        }
                    );

                }

                else {

                    group.style.flexDirection =
                        "";


                    group.style.alignItems =
                        "";


                    buttons.forEach(
                        function (button) {

                            button.style.width =
                                "";

                            button.style.marginRight =
                                "";

                        }
                    );

                }

            }
        );

    }


    updateButtons();


    window.addEventListener(
        "resize",
        debounce(
            updateButtons,
            150
        )
    );

}


/* =========================================================
   RESPONSIVE FONT SIZING
========================================================= */

function initializeResponsiveTypography() {

    const heroTitle =
        document.querySelector(
            ".hero h1"
        );


    if (!heroTitle) {
        return;
    }


    function updateTypography() {

        if (
            window.innerWidth <= 576
        ) {

            heroTitle.style.fontSize =
                "32px";

        }

        else if (
            window.innerWidth <= 991
        ) {

            heroTitle.style.fontSize =
                "42px";

        }

        else {

            heroTitle.style.fontSize =
                "";

        }

    }


    updateTypography();


    window.addEventListener(
        "resize",
        debounce(
            updateTypography,
            150
        )
    );

}


/* =========================================================
   ORIENTATION CHANGE
========================================================= */

function initializeOrientationChange() {

    window.addEventListener(
        "orientationchange",
        function () {

            setTimeout(
                function () {

                    window.dispatchEvent(
                        new Event("resize")
                    );

                },
                300
            );

        }
    );

}


/* =========================================================
   PREVENT HORIZONTAL OVERFLOW
========================================================= */

function preventHorizontalOverflow() {

    document.documentElement.style
        .overflowX = "hidden";

    document.body.style
        .overflowX = "hidden";

}


/* =========================================================
   DEBOUNCE FUNCTION
========================================================= */

function debounce(
    callback,
    delay
) {

    let timer;


    return function () {

        const context =
            this;


        const args =
            arguments;


        clearTimeout(timer);


        timer =
            setTimeout(
                function () {

                    callback.apply(
                        context,
                        args
                    );

                },
                delay
            );

    };

}


/* =========================================================
   INITIALIZE EXTRA RESPONSIVE FEATURES
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeResponsiveHero();

        initializeResponsiveButtons();

        initializeResponsiveTypography();

        initializeOrientationChange();

        preventHorizontalOverflow();

    }
);


/* =========================================================
   WINDOW RESIZE STATUS
========================================================= */

window.addEventListener(
    "resize",
    debounce(
        function () {

            console.log(
                "Responsive layout updated:",
                window.innerWidth + "px"
            );

        },
        500
    )
);


/* =========================================================
   FINAL STATUS
========================================================= */

console.log(
    "AI Welfare Responsive JavaScript initialized successfully."
);