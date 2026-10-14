"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // GET ELEMENTS
    // ==============================

    const form = document.getElementById("registerForm");

    if (!form) {
        console.error("registerForm not found.");
        return;
    }

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const password = document.getElementById("password");
    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms = document.getElementById("terms");

    const message =
        document.getElementById("registerMessage");

    const registerButton =
        document.getElementById("registerButton");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const confirmPasswordToggle =
        document.getElementById("confirmPasswordToggle");

    const strengthBar =
        document.getElementById("passwordStrengthBar");

    const passwordMessage =
        document.getElementById("passwordMessage");


    // ==============================
    // MESSAGE
    // ==============================

    function showMessage(text, type) {

        if (!message) {
            alert(text);
            return;
        }

        message.textContent = text;

        message.className =
            "message " + type;

        message.style.display = "block";
    }


    function hideMessage() {

        if (!message) return;

        message.textContent = "";

        message.className = "message";

        message.style.display = "none";
    }


    // ==============================
    // PASSWORD SHOW / HIDE
    // ==============================

    function setupPasswordToggle(button, input) {

        if (!button || !input) return;

        button.addEventListener("click", function () {

            if (input.type === "password") {

                input.type = "text";

                button.innerHTML =
                    '<i class="bi bi-eye-slash"></i>';

            } else {

                input.type = "password";

                button.innerHTML =
                    '<i class="bi bi-eye"></i>';
            }

        });
    }


    setupPasswordToggle(
        passwordToggle,
        password
    );


    setupPasswordToggle(
        confirmPasswordToggle,
        confirmPassword
    );


    // ==============================
    // MOBILE NUMBER
    // ==============================

    if (mobile) {

        mobile.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );
    }


    // ==============================
    // PASSWORD STRENGTH
    // ==============================

    if (password) {

        password.addEventListener(
            "input",
            function () {

                if (
                    !strengthBar ||
                    !passwordMessage
                ) {
                    return;
                }

                const value = password.value;

                let score = 0;


                if (value.length >= 8) {
                    score++;
                }

                if (/[A-Z]/.test(value)) {
                    score++;
                }

                if (/[a-z]/.test(value)) {
                    score++;
                }

                if (/[0-9]/.test(value)) {
                    score++;
                }

                if (/[^A-Za-z0-9]/.test(value)) {
                    score++;
                }


                if (value.length === 0) {

                    strengthBar.style.width = "0%";

                    strengthBar.style.background =
                        "transparent";

                    passwordMessage.textContent =
                        "Use at least 8 characters.";

                }

                else if (score <= 2) {

                    strengthBar.style.width = "30%";

                    strengthBar.style.background =
                        "#ef4444";

                    passwordMessage.textContent =
                        "Weak password.";

                }

                else if (score === 3) {

                    strengthBar.style.width = "55%";

                    strengthBar.style.background =
                        "#f59e0b";

                    passwordMessage.textContent =
                        "Medium password.";

                }

                else if (score === 4) {

                    strengthBar.style.width = "80%";

                    strengthBar.style.background =
                        "#3b82f6";

                    passwordMessage.textContent =
                        "Good password.";

                }

                else {

                    strengthBar.style.width = "100%";

                    strengthBar.style.background =
                        "#10b981";

                    passwordMessage.textContent =
                        "Strong password.";
                }

            }
        );
    }


    // ==============================
    // REGISTER
    // ==============================

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            hideMessage();


            // ==============================
            // GET VALUES
            // ==============================

            const first =
                firstName.value.trim();

            const last =
                lastName.value.trim();

            const mail =
                email.value.trim().toLowerCase();

            const phone =
                mobile.value.trim();

            const pass =
                password.value;

            const confirm =
                confirmPassword.value;

            const accepted =
                terms ? terms.checked : true;


            // ==============================
            // REQUIRED FIELDS
            // ==============================

            if (
                !first ||
                !last ||
                !mail ||
                !phone ||
                !pass ||
                !confirm
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            // ==============================
            // NAME VALIDATION
            // ==============================

            const namePattern =
                /^[A-Za-zÀ-ÿ\s'-]{2,50}$/;


            if (!namePattern.test(first)) {

                showMessage(
                    "Please enter a valid first name.",
                    "error"
                );

                firstName.focus();

                return;
            }


            if (!namePattern.test(last)) {

                showMessage(
                    "Please enter a valid last name.",
                    "error"
                );

                lastName.focus();

                return;
            }


            // ==============================
            // EMAIL VALIDATION
            // ==============================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(mail)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return;
            }


            // ==============================
            // MOBILE VALIDATION
            // ==============================

            if (!/^[6-9]\d{9}$/.test(phone)) {

                showMessage(
                    "Please enter a valid 10-digit Indian mobile number.",
                    "error"
                );

                mobile.focus();

                return;
            }


            // ==============================
            // PASSWORD VALIDATION
            // ==============================

            if (pass.length < 8) {

                showMessage(
                    "Password must contain at least 8 characters.",
                    "error"
                );

                password.focus();

                return;
            }


            if (!/[A-Z]/.test(pass)) {

                showMessage(
                    "Password must contain at least one uppercase letter.",
                    "error"
                );

                password.focus();

                return;
            }


            if (!/[0-9]/.test(pass)) {

                showMessage(
                    "Password must contain at least one number.",
                    "error"
                );

                password.focus();

                return;
            }


            if (!/[^A-Za-z0-9]/.test(pass)) {

                showMessage(
                    "Password must contain at least one special character.",
                    "error"
                );

                password.focus();

                return;
            }


            // ==============================
            // CONFIRM PASSWORD
            // ==============================

            if (pass !== confirm) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                confirmPassword.focus();

                return;
            }


            // ==============================
            // TERMS
            // ==============================

            if (!accepted) {

                showMessage(
                    "Please accept the Terms of Service and Privacy Policy.",
                    "error"
                );

                return;
            }


            // ==============================
            // CREATE USER OBJECT
            // ==============================

            const newUser = {

                firstName: first,

                lastName: last,

                email: mail,

                mobile: phone,

                password: pass,

                createdAt:
                    new Date().toISOString()
            };


            // ==============================
            // CHECK EXISTING USER
            // ==============================

            let users = [];

            try {

                users = JSON.parse(
                    localStorage.getItem(
                        "aiWelfareUsers"
                    ) || "[]"
                );

                if (!Array.isArray(users)) {
                    users = [];
                }

            } catch (error) {

                console.error(
                    "Could not read users:",
                    error
                );

                users = [];
            }


            const existingUser =
                users.find(function (user) {

                    return (
                        user &&
                        user.email &&
                        String(user.email)
                            .trim()
                            .toLowerCase() === mail
                    );

                });


            // ==============================
            // DUPLICATE EMAIL
            // ==============================

            if (existingUser) {

                showMessage(
                    "An account with this email already exists. Please login.",
                    "error"
                );

                email.focus();

                return;
            }


            // ==============================
            // SAVE USER
            // ==============================

            users.push(newUser);


            try {

                /*
                 * Main users database
                 */
                localStorage.setItem(
                    "aiWelfareUsers",
                    JSON.stringify(users)
                );


                /*
                 * Current/last registered user.
                 * login.js can use this directly.
                 */
                localStorage.setItem(
                    "aiWelfareUser",
                    JSON.stringify(newUser)
                );


                /*
                 * IMPORTANT:
                 * Registration does NOT mean login.
                 */
                localStorage.removeItem(
                    "aiWelfareSession"
                );


            } catch (error) {

                console.error(
                    "LocalStorage error:",
                    error
                );

                showMessage(
                    "Account could not be saved. Please check your browser storage.",
                    "error"
                );

                return;
            }


            // ==============================
            // SUCCESS
            // ==============================

            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            if (registerButton) {

                registerButton.disabled = true;

                registerButton.innerHTML =
                    '<i class="bi bi-check-circle me-2"></i> Account Created';

            }


            // ==============================
            // REDIRECT TO LOGIN
            // ==============================

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }
    );

});