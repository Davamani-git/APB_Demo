(function () {
  "use strict";

  runBlock.$inject = ["$rootScope", "EnvConfigService", "LoggingService"];

  angular
    .module("app")
    .run(runBlock);

  function runBlock($rootScope, EnvConfigService, LoggingService) {
    $rootScope.envReady = false;

    EnvConfigService.load()
      .then(function () {
        $rootScope.envReady = true;
      })
      .catch(function (error) {
        LoggingService.error("Failed to load environment configuration", { error: error });
      });

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
      LoggingService.error("Route change error", {
        event: event,
        current: current,
        previous: previous,
        rejection: rejection
      });
    });
  }
}());
