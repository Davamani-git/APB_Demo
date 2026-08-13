(function() {
  'use strict';
  angular.module('app.shopping')
    .service('OrderService', ['$http', '$q', 'API_BASE_URL', function($http, $q, API_BASE_URL) {
      var self = this;
      self.createOrder = function(cartData, paymentInfo) {
        var orderData = {
          items: cartData.items,
          totalAmount: cartData.totalAmount,
          paymentInfo: paymentInfo
        };
        return $http.post(API_BASE_URL + '/orders', orderData)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getOrderHistory = function() {
        return $http.get(API_BASE_URL + '/orders')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getOrderById = function(orderId) {
        return $http.get(API_BASE_URL + '/orders/' + orderId)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.trackOrder = function(orderId) {
        return $http.get(API_BASE_URL + '/orders/' + orderId + '/tracking')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.cancelOrder = function(orderId) {
        return $http.post(API_BASE_URL + '/orders/' + orderId + '/cancel')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.requestRefund = function(orderId) {
        return $http.post(API_BASE_URL + '/orders/' + orderId + '/refund')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
    }]);
})();