(function () {
  'use strict';

  SpendSummaryApiService.$inject = ['$http', '$q', 'EnvConfigService', 'HttpInterceptorService'];

  angular.module('app')
    .service('SpendSummaryApiService', SpendSummaryApiService);

  function SpendSummaryApiService($http, $q, EnvConfigService, HttpInterceptorService) {
    var self = this;

    self.getMonthlySummary = function (month) {
      var baseUrl = EnvConfigService.getApiBaseUrl();
      var url = baseUrl + '/spend-summary';
      var config = {
        params: {
          month: month
        },
        headers: {
          'Accept': 'application/json'
        }
      };

      HttpInterceptorService.applyTimeout(config);

      return $http.get(url, config).then(function (response) {
        return response.data;
      }).catch(function (error) {
        return $q.reject(error);
      });
    };
  }
})();
