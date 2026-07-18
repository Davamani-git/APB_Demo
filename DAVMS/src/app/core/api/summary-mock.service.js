(function () {
  "use strict";

  summaryMockService.$inject = ["$q", "$timeout", "featureFlagsService"];

  function summaryMockService($q, $timeout, featureFlagsService) {
    const MOCK_SUMMARY = {
      accountId: "CC123456789",
      month: "2024-06",
      kpiSummary: {
        totalSpend: 1234.56,
        transactionCount: 42,
        averageTransactionValue: 29.39
      },
      breakdown: [
        {
          categoryCode: "ONLINE",
          categoryLabel: "Online Purchases",
          amount: 456.78
        },
        {
          categoryCode: "IN_STORE",
          categoryLabel: "In Store",
          amount: 777.78
        },
        {
          categoryCode: "OTHER",
          categoryLabel: "Other",
          amount: 0.0
        }
      ]
    };

    const MOCK_MONTH_OPTIONS = [
      { value: "2024-06", label: "June 2024", isCurrent: true },
      { value: "2024-05", label: "May 2024", isCurrent: false },
      { value: "2024-04", label: "April 2024", isCurrent: false }
    ];

    const service = {
      getMonthlySummary: getMonthlySummary,
      getMonthOptions: getMonthOptions
    };

    function getMonthlySummary(accountId, month) {
      const deferred = $q.defer();
      const delay = featureFlagsService.isMockLatencyEnabled() ? 500 : 0;

      $timeout(function () {
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
          deferred.reject({
            status: 400,
            data: {
              code: "INVALID_MONTH_FORMAT",
              message: "Month must be provided in YYYY-MM format.",
              details: { month: month },
              retryable: false
            }
          });
          return;
        }

        const summary = angular.copy(MOCK_SUMMARY);
        summary.month = month;
        summary.accountId = accountId || MOCK_SUMMARY.accountId;

        deferred.resolve(summary);
      }, delay);

      return deferred.promise;
    }

    function getMonthOptions() {
      const deferred = $q.defer();
      const delay = featureFlagsService.isMockLatencyEnabled() ? 300 : 0;

      $timeout(function () {
        deferred.resolve(angular.copy(MOCK_MONTH_OPTIONS));
      }, delay);

      return deferred.promise;
    }

    return service;
  }

  angular
    .module("app")
    .service("summaryMockService", summaryMockService);
})();
