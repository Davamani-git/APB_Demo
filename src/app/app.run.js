(function () {
  "use strict";

  appRun.$inject = ["$rootScope", "$log", "EnvService"];

  function appRun($rootScope, $log, EnvService) {
    $rootScope.$on("$routeChangeStart", function (event, next) {
      $log.debug("Route change start", next && next.originalPath);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
      $log.error("Route change error", rejection);
    });

    // Initialize environment configuration
    EnvService.initialize();
  }

  angular.module("app")
    .run(appRun);
})();
