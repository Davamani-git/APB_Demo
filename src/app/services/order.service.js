(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('orderService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.createOrder = function(orderData) {
        var deferred = $q.defer();
        $http.post(apiConfig.baseUrl + '/orders', orderData, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getOrders = function(params) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/orders', {params: params, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getOrderById = function(orderId) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/orders/' + orderId, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.updateOrderStatus = function(orderId, status) {
        var deferred = $q.defer();
        $http.put(apiConfig.baseUrl + '/orders/' + orderId, {status: status}, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();