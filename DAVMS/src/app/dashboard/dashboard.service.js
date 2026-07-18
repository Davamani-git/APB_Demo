(function () {
  "use strict";

  dashboardService.$inject = [
    "$q",
    "configService",
    "summaryApiService",
    "summaryMockService",
    "MonthlySummary",
    "ErrorModel"
  ];

  function dashboardService(
    $q,
    configService,
    summaryApiService,
    summaryMockService,
    MonthlySummary,
    ErrorModel
  ) {
    const service = {
      loadMonthlySummary: loadMonthlySummary,
      loadMonthOptions: loadMonthOptions
    };

    function getApi() {
      return configService.isMockModeEnabled() ? summaryMockService : summaryApiService;
    }

    function loadMonthlySummary(accountId, month) {
      const api = getApi();

      return api.getMonthlySummary(accountId, month)
        .then(function (dto) {
          const summaryInstance = MonthlySummary();
          return summaryInstance.fromDto(dto);
        })
        .catch(function (rejection) {
          const error = new ErrorModel().fromResponse(rejection);
          return $q.reject(error);
        });
    }

    function loadMonthOptions() {
      const api = getApi();

      if (api.getMonthOptions) {
        return api.getMonthOptions().then(function (optionsDto) {
          return optionsDto;
        }).catch(function (rejection) {
          const error = new ErrorModel().fromResponse(rejection);
          return $q.reject(error);
        });
      }

      // In production, if month options are not provided, fallback to last N months
      const maxMonths = configService.getMaxLookbackMonths();
      const options = [];
      const now = new Date();

      for (let i = 0; i < Math.min(maxMonths, 12); i += 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const value = year + "-" + month;
        const label = date.toLocaleString("default", { month: "long", year: "numeric" });
        options.push({ value: value, label: label, isCurrent: i === 0 });
      }

      return $q.resolve(options);
    }

    return service;
  }

  angular
    .module("app.dashboard")
    .service("dashboardService", dashboardService);
})();
