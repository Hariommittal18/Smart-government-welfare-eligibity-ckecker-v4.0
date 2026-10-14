document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const loginButton =
        document.getElementById("loginButton");

    const loginMessage =
        document.getElementById("loginMessage");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const rememberMe =
        document.getElementById("rememberMe");

    const forgotPassword =
        document.getElementById("forgotPassword");


    /* =========================================
       SHOW MESSAGE
    ========================================= */

    function showMessage(message, type) {

        loginMessage.textContent = message;

        loginMessage.className =
            "message " + type;

    }


    /* =========================================
       GET REGISTERED USER
    ========================================= */

    function getUser() {

        const savedUser =
            localStorage.getItem("aiWelfareUser");

        if (!savedUser) {

            return null;

        }


        try {

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            return null;

        }

    }


    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    passwordToggle.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                passwordToggle.innerHTML =
                    '<i class="bi bi-eye-slash"></i>';

            } else {

                passwordInput.type =
                    "password";

                passwordToggle.innerHTML =
                    '<i class="bi bi-eye"></i>';

            }

        }
    );


    /* =========================================
       REMEMBERED EMAIL
    ========================================= */

    const rememberedEmail =
        localStorage.getItem(
            "aiWelfareRememberedEmail"
        );


    if (rememberedEmail) {

        emailInput.value =
            rememberedEmail;

        rememberMe.checked =
            true;

    }


    /* =========================================
       LOGIN
    ========================================= */

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            /* ==============================
               EMPTY CHECK
            ============================== */

            if (
                !email ||
                !password
            ) {

                showMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }


            /* ==============================
               GET USER
            ============================== */

            const user =
                getUser();


            if (!user) {

                showMessage(
                    "No account found. Please register first.",
                    "error"
                );

                return;

            }


            const savedEmail =
                String(
                    user.email || ""
                )
                    .trim()
                    .toLowerCase();


            const savedPassword =
                String(
                    user.password || ""
                );


            /* ==============================
               PASSWORD NOT FOUND
            ============================== */

            if (!savedPassword) {

                showMessage(
                    "Account data is incomplete. Please register again.",
                    "error"
                );

                return;

            }


            /* ==============================
               LOGIN CHECK
            ============================== */

            if (
                email !== savedEmail ||
                password !== savedPassword
            ) {

                showMessage(
                    "Invalid email or password. Please try again.",
                    "error"
                );

                return;

            }


            /* ==============================
               REMEMBER ME
            ============================== */

            if (rememberMe.checked) {

                localStorage.setItem(
                    "aiWelfareRememberedEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "aiWelfareRememberedEmail"
                );

            }


            /* ==============================
               CREATE LOGIN SESSION
            ============================== */

            const sessionData = {

                email: savedEmail,

                firstName:
                    user.firstName || "",

                lastName:
                    user.lastName || "",

                loggedIn: true,

                loginTime:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "aiWelfareSession",
                JSON.stringify(sessionData)
            );


            /* ==============================
               SUCCESS
            ============================== */

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            loginButton.disabled =
                true;


            loginButton.innerHTML =
                '<i class="bi bi-check-circle me-2"></i> Login Successful';


            /* ==============================
               REDIRECT
            ============================== */

            setTimeout(
                function () {

                    window.location.href =
                        "eligibility.html";

                },
                1000
            );

        }
    );


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const user =
                getUser();


            if (!user) {

                showMessage(
                    "No registered account found. Please register first.",
                    "error"
                );

                return;

            }


            showMessage(
                "Password recovery is not connected to an email service in this frontend demo.",
                "error"
            );

        }
    );

});