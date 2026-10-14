/* =========================================================
   AI WELFARE
   COMMON APPLICATION JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("AI Welfare Frontend Loaded Successfully");


    /* =====================================================
       MOBILE NAVIGATION
       Works with common navbar structures
    ===================================================== */

    const menuButtons = document.querySelectorAll(
        ".navbar-toggler, .menu-toggle, .mobile-menu-btn"
    );

    menuButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId =
                button.getAttribute("data-target");

            let menu = null;


            /* ---------------------------------------------
               Bootstrap style target
            --------------------------------------------- */

            if (targetId) {

                menu =
                    document.querySelector(targetId) ||
                    document.getElementById(
                        targetId.replace("#", "")
                    );

            }


            /* ---------------------------------------------
               Common menu selectors
            --------------------------------------------- */

            if (!menu) {

                menu =
                    document.querySelector(
                        ".navbar-collapse"
                    ) ||
                    document.querySelector(
                        ".nav-menu"
                    ) ||
                    document.querySelector(
                        ".eligibility-navigation"
                    );

            }


            if (!menu) {
                return;
            }


            menu.classList.toggle("show");


            const expanded =
                menu.classList.contains("show");


            button.setAttribute(
                "aria-expanded",
                expanded ? "true" : "false"
            );

        });

    });


    /* =====================================================
       CLOSE MOBILE MENU AFTER LINK CLICK
    ===================================================== */

    const mobileLinks =
        document.querySelectorAll(
            ".navbar-nav a, .nav-menu a, .eligibility-nav-menu a"
        );


    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const menus =
                document.querySelectorAll(
                    ".navbar-collapse.show, .nav-menu.show, .eligibility-navigation.show"
                );


            menus.forEach(function (menu) {

                menu.classList.remove("show");

            });

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navigationLinks =
        document.querySelectorAll(
            ".navbar-nav a, .nav-menu a, .eligibility-nav-menu a"
        );


    navigationLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");


        if (!href) {
            return;
        }


        const linkPage =
            href.split("/")
                .pop()
                .split("?")[0]
                .toLowerCase();


        if (
            linkPage === currentPage ||
            (
                currentPage === "" &&
                linkPage === "index.html"
            )
        ) {

            link.classList.add("active");

        }

    });


    /* =====================================================
       BACK TO TOP BUTTON
    ===================================================== */

    const backToTop =
        document.querySelector(
            "#backToTop, .back-to-top"
        );


    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 400) {

                    backToTop.classList.add("show");

                } else {

                    backToTop.classList.remove("show");

                }

            }
        );


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL FOR INTERNAL LINKS
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (target) {

                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       COUNTER ANIMATION
    ===================================================== */

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    if (counters.length > 0) {

        const counterObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (!entry.isIntersecting) {
                                return;
                            }


                            const counter =
                                entry.target;


                            if (
                                counter.dataset.animated ===
                                "true"
                            ) {
                                return;
                            }


                            counter.dataset.animated =
                                "true";


                            const target =
                                Number(
                                    counter.getAttribute(
                                        "data-target"
                                    )
                                );


                            if (
                                !Number.isFinite(target)
                            ) {

                                counter.textContent =
                                    "0";

                                return;

                            }


                            animateCounter(
                                counter,
                                target
                            );


                            observer.unobserve(
                                counter
                            );

                        }
                    );

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(
            function (counter) {

                counterObserver.observe(
                    counter
                );

            }
        );

    }


    /* =====================================================
       BUTTON RIPPLE EFFECT
    ===================================================== */

    const rippleButtons =
        document.querySelectorAll(
            ".btn, .check-eligibility-btn, .login-btn"
        );


    rippleButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    const ripple =
                        document.createElement(
                            "span"
                        );


                    ripple.classList.add(
                        "button-ripple"
                    );


                    const rect =
                        button.getBoundingClientRect();


                    const size =
                        Math.max(
                            rect.width,
                            rect.height
                        );


                    ripple.style.width =
                        size + "px";

                    ripple.style.height =
                        size + "px";


                    ripple.style.left =
                        (
                            event.clientX -
                            rect.left -
                            size / 2
                        ) + "px";


                    ripple.style.top =
                        (
                            event.clientY -
                            rect.top -
                            size / 2
                        ) + "px";


                    button.appendChild(
                        ripple
                    );


                    setTimeout(
                        function () {

                            ripple.remove();

                        },
                        600
                    );

                }
            );

        }
    );


    /* =====================================================
       CONTACT FORM BASIC HANDLER
    ===================================================== */

    const contactForm =
        document.querySelector(
            "#contactForm"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    contactForm.querySelector(
                        '[name="name"]'
                    );

                const email =
                    contactForm.querySelector(
                        '[name="email"]'
                    );

                const message =
                    contactForm.querySelector(
                        '[name="message"]'
                    );


                if (
                    name &&
                    !name.value.trim()
                ) {

                    showAppMessage(
                        "Please enter your name.",
                        "error"
                    );

                    name.focus();

                    return;

                }


                if (
                    email &&
                    !isValidEmail(
                        email.value.trim()
                    )
                ) {

                    showAppMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    email.focus();

                    return;

                }


                if (
                    message &&
                    !message.value.trim()
                ) {

                    showAppMessage(
                        "Please enter your message.",
                        "error"
                    );

                    message.focus();

                    return;

                }


                showAppMessage(
                    "Thank you! Your message has been submitted successfully.",
                    "success"
                );


                contactForm.reset();

            }
        );

    }


    /* =====================================================
       NEWSLETTER FORM
    ===================================================== */

    const newsletterForms =
        document.querySelectorAll(
            ".newsletter-form"
        );


    newsletterForms.forEach(
        function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const emailInput =
                        form.querySelector(
                            'input[type="email"]'
                        );


                    if (
                        !emailInput ||
                        !isValidEmail(
                            emailInput.value.trim()
                        )
                    ) {

                        showAppMessage(
                            "Please enter a valid email address.",
                            "error"
                        );

                        return;

                    }


                    showAppMessage(
                        "Thank you for subscribing to AI Welfare updates.",
                        "success"
                    );


                    form.reset();

                }
            );

        }
    );


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    const passwordToggles =
        document.querySelectorAll(
            ".password-toggle, [data-password-toggle]"
        );


    passwordToggles.forEach(
        function (toggle) {

            toggle.addEventListener(
                "click",
                function () {

                    const targetId =
                        toggle.getAttribute(
                            "data-password-toggle"
                        );


                    let passwordInput = null;


                    if (targetId) {

                        passwordInput =
                            document.getElementById(
                                targetId
                            );

                    }


                    if (!passwordInput) {

                        passwordInput =
                            toggle
                                .closest(".input-group, .password-wrapper")
                                ?.querySelector(
                                    'input[type="password"], input[type="text"]'
                                );

                    }


                    if (!passwordInput) {
                        return;
                    }


                    if (
                        passwordInput.type ===
                        "password"
                    ) {

                        passwordInput.type =
                            "text";

                        toggle.classList.remove(
                            "bi-eye"
                        );

                        toggle.classList.add(
                            "bi-eye-slash"
                        );

                    } else {

                        passwordInput.type =
                            "password";

                        toggle.classList.remove(
                            "bi-eye-slash"
                        );

                        toggle.classList.add(
                            "bi-eye"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       SCHEME SEARCH
    ===================================================== */

    const schemeSearch =
        document.querySelector(
            "#schemeSearch, .scheme-search"
        );


    if (schemeSearch) {

        schemeSearch.addEventListener(
            "input",
            function () {

                const searchValue =
                    schemeSearch.value
                        .toLowerCase()
                        .trim();


                const schemeCards =
                    document.querySelectorAll(
                        ".scheme-card"
                    );


                schemeCards.forEach(
                    function (card) {

                        const cardText =
                            card.textContent
                                .toLowerCase();


                        if (
                            cardText.includes(
                                searchValue
                            )
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       SCHEME CATEGORY FILTER
    ===================================================== */

    const schemeFilter =
        document.querySelector(
            "#schemeFilter"
        );


    if (schemeFilter) {

        schemeFilter.addEventListener(
            "change",
            function () {

                const selected =
                    schemeFilter.value
                        .toLowerCase();


                const cards =
                    document.querySelectorAll(
                        ".scheme-card"
                    );


                cards.forEach(
                    function (card) {

                        const category =
                            (
                                card.getAttribute(
                                    "data-category"
                                ) || ""
                            ).toLowerCase();


                        if (
                            !selected ||
                            selected === "all" ||
                            category === selected
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       LAZY IMAGE FALLBACK
    ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    image.classList.add(
                        "image-error"
                    );

                    console.warn(
                        "Image could not be loaded:",
                        image.src
                    );

                }
            );

        }
    );


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElements =
        document.querySelectorAll(
            "#currentYear, .current-year"
        );


    yearElements.forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    const pageLoader =
        document.querySelector(
            "#pageLoader, .page-loader"
        );


    if (pageLoader) {

        window.addEventListener(
            "load",
            function () {

                pageLoader.classList.add(
                    "hide"
                );


                setTimeout(
                    function () {

                        pageLoader.style.display =
                            "none";

                    },
                    500
                );

            }
        );

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .fade-in"
        );


    if (
        revealElements.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    }


});


/* =========================================================
   COUNTER ANIMATION FUNCTION
========================================================= */

function animateCounter(element, target) {

    const duration = 1800;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.floor(
                easedProgress * target
            );


        element.textContent =
            currentValue.toLocaleString();


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            element.textContent =
                target.toLocaleString();

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* =========================================================
   COMMON MESSAGE
========================================================= */

function showAppMessage(text, type = "success") {

    let message =
        document.getElementById(
            "appMessage"
        );


    if (!message) {

        message =
            document.createElement(
                "div"
            );

        message.id =
            "appMessage";


        message.style.position =
            "fixed";

        message.style.top =
            "100px";

        message.style.right =
            "25px";

        message.style.zIndex =
            "99999";

        message.style.maxWidth =
            "380px";

        message.style.padding =
            "15px 20px";

        message.style.borderRadius =
            "12px";

        message.style.fontFamily =
            "Poppins, sans-serif";

        message.style.fontSize =
            "14px";

        message.style.fontWeight =
            "500";

        message.style.boxShadow =
            "0 15px 35px rgba(0,0,0,0.15)";

        document.body.appendChild(
            message
        );

    }


    if (type === "error") {

        message.style.background =
            "#fef2f2";

        message.style.color =
            "#b91c1c";

        message.style.border =
            "1px solid #fecaca";

    } else {

        message.style.background =
            "#ecfdf5";

        message.style.color =
            "#166534";

        message.style.border =
            "1px solid #bbf7d0";

    }


    message.textContent =
        text;


    message.style.display =
        "block";


    clearTimeout(
        window.appMessageTimer
    );


    window.appMessageTimer =
        setTimeout(
            function () {

                message.style.opacity =
                    "0";

                message.style.transition =
                    "opacity 0.3s ease";


                setTimeout(
                    function () {

                        message.style.display =
                            "none";

                        message.style.opacity =
                            "1";

                    },
                    300
                );

            },
            3500
        );

}