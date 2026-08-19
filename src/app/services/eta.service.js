(function() {
  'use strict';
  angular.module('foodDeliveryApp')
    .service('ETAService', ['$http', '$interval', function($http, $interval) {
      var etaCache = {};
      var refreshInterval = null;
      this.getETA = function(orderId) {
        return $http.get('/api/orders/' + orderId + '/eta')
          .then(function(response) {
            etaCache[orderId] = response.data;
            return response.data;
          })
          .catch(function(error) {
            if (etaCache[orderId]) {
              return etaCache[orderId];
            }
            return { eta: null, confidence: 'low' };
          });
      };
      this.startAutoRefresh = function(orderId, callback) {
        this.stopAutoRefresh();
        refreshInterval = $interval(function() {
          this.getETA(orderId).then(callback);
        }.bind(this), 180000);
      };
      this.stopAutoRefresh = function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
          refreshInterval = null;
        }
      };
    }]);
})();