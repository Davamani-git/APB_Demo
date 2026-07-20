(function () {
  "use strict";

  SpendSummaryService.$inject = ["$q", "EnvConfigService", "SpendSummaryApiService", "SpendSummaryMockService", "LoggingService"];

  function SpendSummaryService($q, EnvConfigService, SpendSummaryApiService, SpendSummaryMockService, LoggingService) {
    this.getMonthlySummary = function (month) {
      var useMock = EnvConfigService.isMockMode();
      LoggingService.info("Fetching monthly summary", { month: month, useMock: useMock });

      var service = useMock ? SpendSummaryMockService : SpendSummaryApiService;
      return service.getMonthlySummary(month);
    };

    this.getDefaultMonth = function () {
      var now = new Date();
      // Default to last full month
      var year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      var monthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      var monthNumber = monthIndex + 1;
      var paddedMonth = monthNumber < 10 ? "0" + monthNumber : String(monthNumber);
      return year + "-" + paddedMonth;
    };
  }

  angular
    .module("app")
    .service("SpendSummaryService", SpendSummaryService);
}());
