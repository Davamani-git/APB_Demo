(function () {
  "use strict";

  SpendingDashboardMockService.$inject = ["$q", "$timeout", "ENV_CONFIG", "LoggingService"];

  function SpendingDashboardMockService($q, $timeout, ENV_CONFIG, LoggingService) {
    var service = {
      getMonthlySummary: getMonthlySummary,
      getMonthlyBreakdown: getMonthlyBreakdown
    };

    return service;

    function getMonthlySummary(cardId, month) {
      var deferred = $q.defer();
      var delayMs = 300;

      LoggingService.debug("Mock monthly summary request", { cardId: cardId, month: month });

      $timeout(function () {
        if (!cardId || !month) {
          var error = {
            status: 400,
            data: {
              code: "INVALID_REQUEST",
              message: "cardId and month are required"
            }
          };
          LoggingService.warn("Mock monthly summary invalid request", error);
          deferred.reject(error);
          return;
        }

        var response = {
          cardId: cardId,
          month: month,
          totalSpend: 1250.75,
          currency: "USD",
          transactionCount: 42,
          averageTransactionAmount: 29.78,
          maxTransactionAmount: 210.50
        };

        LoggingService.info("Mock monthly summary response", response);
        deferred.resolve(response);
      }, delayMs);

      return deferred.promise;
    }

    function getMonthlyBreakdown(cardId, month) {
      var deferred = $q.defer();
      var delayMs = 350;

      LoggingService.debug("Mock monthly breakdown request", { cardId: cardId, month: month });

      $timeout(function () {
        if (!cardId || !month) {
          var error = {
            status: 400,
            data: {
              code: "INVALID_REQUEST",
              message: "cardId and month are required"
            }
          };
          LoggingService.warn("Mock monthly breakdown invalid request", error);
          deferred.reject(error);
          return;
        }

        var response = {
          cardId: cardId,
          month: month,
          currency: "USD",
          categories: [
            { name: "Groceries", amount: 350.00 },
            { name: "Dining", amount: 275.50 },
            { name: "Travel", amount: 400.25 },
            { name: "Utilities", amount: 125.00 },
            { name: "Other", amount: 100.00 }
          ]
        };

        LoggingService.info("Mock monthly breakdown response", response);
        deferred.resolve(response);
      }, delayMs);

      return deferred.promise;
    }
  }

  angular.module("app")
    .service("SpendingDashboardMockService", SpendingDashboardMockService);
})();
