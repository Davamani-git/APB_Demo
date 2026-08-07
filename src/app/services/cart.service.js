(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('cartService', ['$http', '$q', '$window', 'apiConfig', function($http, $q, $window, apiConfig) {
      var self = this;
      var cartKey = 'shoppingCart';
      self.getCart = function() {
        var cart = $window.localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
      };
      self.saveCart = function(cart) {
        $window.localStorage.setItem(cartKey, JSON.stringify(cart));
      };
      self.addItem = function(product, quantity) {
        var cart = self.getCart();
        var existingItem = cart.find(function(item) { return item.productId === product.productId; });
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            cartItemId: Date.now().toString(),
            productId: product.productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            imageUrl: product.imageUrl
          });
        }
        self.saveCart(cart);
        return self.syncCart();
      };
      self.removeItem = function(cartItemId) {
        var cart = self.getCart();
        cart = cart.filter(function(item) { return item.cartItemId !== cartItemId; });
        self.saveCart(cart);
        return self.syncCart();
      };
      self.updateQuantity = function(cartItemId, quantity) {
        var cart = self.getCart();
        var item = cart.find(function(item) { return item.cartItemId === cartItemId; });
        if (item) {
          item.quantity = quantity;
          self.saveCart(cart);
        }
        return self.syncCart();
      };
      self.clearCart = function() {
        $window.localStorage.removeItem(cartKey);
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };
      self.syncCart = function() {
        var deferred = $q.defer();
        var cart = self.getCart();
        $http.post(apiConfig.baseUrl + '/cart/sync', {items: cart}, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getCartTotal = function() {
        var cart = self.getCart();
        return cart.reduce(function(total, item) {
          return total + (item.price * item.quantity);
        }, 0);
      };
    }]);
})();