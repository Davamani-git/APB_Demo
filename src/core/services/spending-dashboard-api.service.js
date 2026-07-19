(function () {
  "use strict";

  SpendingDashboardApiService.$inject = ["$http", "$q", "ENV_CONFIG", "LoggingService"];

  function SpendingDashboardApiService($http, $q, ENV_CONFIG, LoggingService) {
    var service = {
      getMonthlySummary: getMonthlySummary,
      getMonthlyBreakdown: getMonthlyBreakdown
    };

    return service;

    function getMonthlySummary(cardId, month) {
      var url = ENV_CONFIG.apiBaseUrl + "/summary";
      var config = {
        params: {
          cardId: cardId,
          month: month
        },
        timeout: ENV_CONFIG.apiTimeoutMs,
        headers: {
          "Accept": "application/json"
        }
      };

      LoggingService.debug("Requesting monthly summary", { url: url, params: config.params });

      return $http.get(url, config)
        .then(function (response) {
          LoggingService.info("Monthly summary received", { status: response.status });
          return response.data;
        })
        .catch(function (error) {
          LoggingService.error("Monthly summary request failed", error);
          return $q.reject(error);
        });
    }

    function getMonthlyBreakdown(cardId, month) {
      var url = ENV_CONFIG.apiBaseUrl + "/breakdown";
      var config = {
        params: {
          cardId: cardId,
          month: month
        },
        timeout: ENV_CONFIG.apiTimeoutMs,
        headers: {
          "Accept": "application/json"
        }
      };

      LoggingService.debug("Requesting monthly breakdown", { url: url, params: config.params });

      return $http.get(url, config)
        .then(function (response) {
          LoggingService.info("Monthly breakdown received", { status: response.status });
          return response.data;
        })
        .catch(function (error) {
          LoggingService.error("Monthly breakdown request failed", error);
          return $q.reject(error);
        });
    }
  }

  angular.module("app")
    .service("SpendingDashboardApiService", SpendingDashboardApiService);
})();
