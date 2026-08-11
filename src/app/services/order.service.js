(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('OrderService', ['$http', '$q', OrderService]);
  function OrderService($http, $q) {
    var self = this;
    var API_BASE = 'https://api.shopping.com';
    var orders = [];
    self.createOrder = function(orderData) {
      var deferred = $q.defer();
      setTimeout(function() {
        orders.push(orderData);
        deferred.resolve(orderData);
      }, 300);
      return deferred.promise;
    };
    self.getOrderHistory = function(userId) {
      var deferred = $q.defer();
      setTimeout(function() {
        var userOrders = orders.filter(function(o) { return o.userId === userId; });
        deferred.resolve(userOrders);
      }, 500);
      return deferred.promise;
    };
    self.getOrderById = function(orderId) {
      var deferred = $q.defer();
      setTimeout(function() {
        var order = orders.find(function(o) { return o.orderId === orderId; });
        if (order) {
          deferred.resolve(order);
        } else {
          deferred.reject('Order not found');
        }
      }, 300);
      return deferred.promise;
    };
    self.cancelOrder = function(orderId) {
      var deferred = $q.defer();
      setTimeout(function() {
        var order = orders.find(function(o) { return o.orderId === orderId; });
        if (order) {
          order.status = 'Cancelled';
          deferred.resolve(order);
        } else {
          deferred.reject('Order not found');
        }
      }, 500);
      return deferred.promise;
    };
  }
})();