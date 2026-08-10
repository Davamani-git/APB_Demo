(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .factory('AnalyticsService', ['$http', '$q', function($http, $q) {
      var apiBase = '/api/analytics';
      return {
        getSalesData: function(sellerId, period) {
          return $http.get(apiBase + '/sales?sellerId=' + sellerId + '&period=' + period)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getDashboardMetrics: function(sellerId) {
          return $http.get(apiBase + '/dashboard?sellerId=' + sellerId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getTopProducts: function(sellerId, limit) {
          return $http.get(apiBase + '/top-products?sellerId=' + sellerId + '&limit=' + limit)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();