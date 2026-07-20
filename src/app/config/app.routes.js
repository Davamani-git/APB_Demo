(function () {
    "use strict";

    angular.module("app")
        .config(appRoutesConfig);

    appRoutesConfig.$inject = ["$routeProvider", "$locationProvider"];

    function appRoutesConfig($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix("");

        $routeProvider
            .otherwise({
                redirectTo: "/monthly-summary"
            });
    }
})();
