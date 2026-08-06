(function() {
  'use strict';
  angular.module('shoppingPlatform').service('OrderManagementService', ['$http', 'API_CONFIG', 'AuthService', function($http, API_CONFIG, AuthService) {
    this.getSellerOrders = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/seller/orders', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.getRecentOrders = function(limit) {
      return this.getSellerOrders().then(function(orders) {
        return orders.slice(0, limit || 10);
      });
    };
    this.updateOrderStatus = function(orderId, status) {
      return $http.put(API_CONFIG.baseUrl + '/api/orders/' + orderId + '/fulfillment', { status: status }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();