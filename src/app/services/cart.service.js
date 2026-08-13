(function() {
  'use strict';
  angular.module('app.shopping')
    .service('CartService', ['$http', 'CartFactory', 'API_BASE_URL', function($http, CartFactory, API_BASE_URL) {
      var self = this;
      self.addItem = function(productId, quantity) {
        return $http.post(API_BASE_URL + '/cart/items', { productId: productId, quantity: quantity })
          .then(function(response) {
            CartFactory.setCart(response.data);
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.removeItem = function(productId) {
        return $http.delete(API_BASE_URL + '/cart/items/' + productId)
          .then(function(response) {
            CartFactory.setCart(response.data);
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.updateQuantity = function(productId, quantity) {
        return $http.put(API_BASE_URL + '/cart/items/' + productId, { quantity: quantity })
          .then(function(response) {
            CartFactory.setCart(response.data);
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getCart = function() {
        return $http.get(API_BASE_URL + '/cart')
          .then(function(response) {
            CartFactory.setCart(response.data);
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.clearCart = function() {
        return $http.delete(API_BASE_URL + '/cart')
          .then(function(response) {
            CartFactory.clearCart();
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getCartState = function() {
        return CartFactory.getCart();
      };
    }]);
})();