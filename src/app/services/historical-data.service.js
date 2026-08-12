(function() {
  'use strict';
  angular.module('spendingAnalytics').service('HistoricalDataService', ['$http', '$q', function($http, $q) {
    var service = this;
    var apiBaseUrl = '/api/analytics/historical';

    service.getHistoricalData = function(months) {
      return $http.get(apiBaseUrl + '?months=' + months).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();