(function () {
    "use strict";

    angular.module("app", [
        "ngRoute",
        "ngAnimate",
        "ngSanitize",
        "ui.bootstrap"
    ])
        .run(appRun);

    appRun.$inject = ["$rootScope", "LoggingService"];

    function appRun($rootScope, LoggingService) {
        $rootScope.$on("$routeChangeSuccess", function (event, current) {
            LoggingService.info("Route changed", {
                route: current && current.originalPath
            });
        });
    }
})();
