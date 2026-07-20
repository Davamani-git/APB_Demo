(function () {
  "use strict";

  SpendSummaryMockService.$inject = ["$q", "$timeout", "EnvConfigService", "LoggingService", "SpendSummaryModel", "KpiSummaryModel", "SpendBreakdownModel", "ErrorModel"];

  function SpendSummaryMockService($q, $timeout, EnvConfigService, LoggingService, SpendSummaryModel, KpiSummaryModel, SpendBreakdownModel, ErrorModel) {
    this.getMonthlySummary = function (month) {
      var deferred = $q.defer();

      if (!/^\d{4}-\d{2}$/.test(month)) {
        var invalidError = new ErrorModel({
          code: "400",
          message: "Invalid month format. Expected YYYY-MM.",
          details: { month: month },
          retryable: false
        });
        deferred.reject(invalidError);
        return deferred.promise;
      }

      var maxLookbackMonths = EnvConfigService.getMaxLookbackMonths();

      if (isOlderThanLookback(month, maxLookbackMonths)) {
        var notFoundError = new ErrorModel({
          code: "404",
          message: "Monthly summary not available for the requested month.",
          details: { month: month, maxLookbackMonths: maxLookbackMonths },
          retryable: false
        });
        deferred.reject(notFoundError);
        return deferred.promise;
      }

      var randomFailure = Math.random() < 0.05;

      $timeout(function () {
        if (randomFailure) {
          var failureError = new ErrorModel({
            code: "503",
            message: "Mock service simulated a temporary failure.",
            details: { month: month },
            retryable: true
          });
          LoggingService.warn("Mock monthly summary failure", { error: failureError });
          deferred.reject(failureError);
          return;
        }

        var responseJson = {
          summary: {
            month: month,
            customerId: "C123456789",
            cardId: "CARD987654321",
            totalSpend: 1534.75,
            currency: "USD",
            transactionCount: 42,
            generatedAt: new Date().toISOString()
          },
          kpis: {
            month: month,
            totalSpend: 1534.75,
            transactionCount: 42,
            averageTransactionAmount: 36.54,
            maxTransactionAmount: 220.00
          },
          breakdown: {
            month: month,
            currency: "USD",
            items: [
              { categoryCode: "GROCERY", categoryName: "Groceries", amount: 450.25, percentage: 29.33 },
              { categoryCode: "TRAVEL", categoryName: "Travel", amount: 300.00, percentage: 19.54 },
              { categoryCode: "DINING", categoryName: "Dining", amount: 250.50, percentage: 16.32 },
              { categoryCode: "UTILITIES", categoryName: "Utilities", amount: 200.00, percentage: 13.03 },
              { categoryCode: "OTHER", categoryName: "Other", amount: 334.00, percentage: 21.78 }
            ]
          }
        };

        var summary = new SpendSummaryModel(responseJson.summary);
        var kpis = new KpiSummaryModel(responseJson.kpis);
        var breakdown = new SpendBreakdownModel(responseJson.breakdown);

        deferred.resolve({
          summary: summary,
          kpis: kpis,
          breakdown: breakdown
        });
      }, 650);

      return deferred.promise;
    };

    function isOlderThanLookback(month, maxLookbackMonths) {
      var parts = month.split("-");
      var year = parseInt(parts[0], 10);
      var monthIndex = parseInt(parts[1], 10) - 1;

      var requestedDate = new Date(year, monthIndex, 1);
      var now = new Date();
      var currentDate = new Date(now.getFullYear(), now.getMonth(), 1);

      var diffMonths = (currentDate.getFullYear() - requestedDate.getFullYear()) * 12 + (currentDate.getMonth() - requestedDate.getMonth());
      return diffMonths > maxLookbackMonths;
    }
  }

  angular
    .module("app")
    .service("SpendSummaryMockService", SpendSummaryMockService);
}());
