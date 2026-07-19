(function () {
    "use strict";

    angular.module("app")
        .constant("ROUTE_CONSTANTS", {
            MONTHLY_SUMMARY: {
                id: "MONTHLY_SUMMARY",
                path: "/spending/monthly-summary"
            }
        });
})();
