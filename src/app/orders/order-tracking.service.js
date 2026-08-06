(function() {
  'use strict';
  angular.module('shoppingPlatform').service('OrderTrackingService', ['$http', '$interval', 'API_CONFIG', function($http, $interval, API_CONFIG) {
    this.getTrackingInfo = function(orderId) {
      return $http.get(API_CONFIG.baseUrl + '/api/orders/' + orderId + '/tracking', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.subscribeToUpdates = function(orderId, callback) {
      var interval = $interval(function() {
        this.getTrackingInfo(orderId).then(function(trackingInfo) {
          callback(trackingInfo);
        }).catch(function(error) {
          console.error('Error polling tracking info:', error);
        });
      }.bind(this), 30000);
      return interval;
    };
  }]);
})();