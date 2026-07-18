(function () {
  "use strict";

  summaryApiService.$inject = ["$http", "$q", "configService"];

  function summaryApiService($http, $q, configService) {
    const service = {
      getMonthlySummary: getMonthlySummary
    };

    function getMonthlySummary(accountId, month) {
      if (!accountId || !month) {
        return $q.reject({
          status: 400,
          data: {
            code: "INVALID_INPUT",
            message: "accountId and month are required.",
            details: {},
            retryable: false
          }
        });
      }

      const url = configService.getApiBaseUrl() + "/summary";
      const config = {
        params: {
          accountId: accountId,
          month: month
        },
        timeout: configService.getApiTimeoutMs()
      };

      return $http.get(url, config).then(function (response) {
        return response.data;
      });
    }

    return service;
  }

  angular
    .module("app")
    .service("summaryApiService", summaryApiService);
})();
