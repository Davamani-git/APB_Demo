(function() {
  'use strict';
  angular.module('shoppingPlatform').service('OrderService', ['$http', '$q', 'API_CONFIG', 'AuthService', function($http, $q, API_CONFIG, AuthService) {
    this.createOrder = function(orderData) {
      return $http.post(API_CONFIG.baseUrl + '/api/orders', orderData, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.getOrderDetails = function(orderId) {
      return $http.get(API_CONFIG.baseUrl + '/api/orders/' + orderId, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.getUserOrders = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/orders', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.updateOrderStatus = function(orderId, status) {
      return $http.put(API_CONFIG.baseUrl + '/api/orders/' + orderId + '/status', { status: status }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();