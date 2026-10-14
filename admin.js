document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Temporary dashboard data
         *
         * Later these values will come
         * from Spring Boot + MySQL.
         */

        const dashboardData = {

            totalUsers: 12540,

            totalSchemes: 524,

            voiceQueries: 8920,

            applications: 2340

        };


        document.getElementById(
            "totalUsers"
        ).textContent =
            dashboardData.totalUsers.toLocaleString();


        document.getElementById(
            "totalSchemes"
        ).textContent =
            dashboardData.totalSchemes.toLocaleString();


        document.getElementById(
            "voiceQueries"
        ).textContent =
            dashboardData.voiceQueries.toLocaleString();


        document.getElementById(
            "applications"
        ).textContent =
            dashboardData.applications.toLocaleString();


        console.log(
            "✅ Admin Dashboard Loaded"
        );


        /*
         * Quick Actions
         */

        const addSchemeButton =
            document.getElementById(
                "addSchemeButton"
            );


        if (addSchemeButton) {

            addSchemeButton.addEventListener(
                "click",
                function () {

                    alert(
                        "Add Scheme feature will be connected to backend."
                    );

                }
            );

        }


        const manageSchemesButton =
            document.getElementById(
                "manageSchemesButton"
            );


        if (manageSchemesButton) {

            manageSchemesButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "schemes.html";

                }
            );

        }


        const viewUsersButton =
            document.getElementById(
                "viewUsersButton"
            );


        if (viewUsersButton) {

            viewUsersButton.addEventListener(
                "click",
                function () {

                    alert(
                        "User management will be connected to backend."
                    );

                }
            );

        }

    }
);