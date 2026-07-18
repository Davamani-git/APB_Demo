(function () {
  "use strict";

  featureFlagsService.$inject = ["configService"];

  function featureFlagsService(configService) {
    const flags = angular.copy(configService.getFeatureFlags());

    const service = {
      loadStaticFlags: loadStaticFlags,
      isBreakdownChartEnabled: isBreakdownChartEnabled,
      isKpiCardsEnabled: isKpiCardsEnabled,
      isMockLatencyEnabled: isMockLatencyEnabled,
      getEnvironmentName: getEnvironmentName
    };

    function loadStaticFlags() {
      // No-op for now; flags are loaded from ENV_CONFIG
      return flags;
    }

    function isBreakdownChartEnabled() {
      return !!flags.showBreakdownChart;
    }

    function isKpiCardsEnabled() {
      return !!flags.showKpiCards;
    }

    function isMockLatencyEnabled() {
      return !!flags.enableLatencySimulationInMock;
    }

    function getEnvironmentName() {
      return configService.isMockModeEnabled() ? "mock" : "production";
    }

    return service;
  }

  angular
    .module("app")
    .service("featureFlagsService", featureFlagsService);
})();
