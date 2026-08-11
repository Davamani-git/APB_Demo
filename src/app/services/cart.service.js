(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('CartService', ['$http', '$rootScope', '$q', CartService]);
  function CartService($http, $rootScope, $q) {
    var self = this;
    var API_BASE = 'https://api.shopping.com';
    var cart = [];
    self.getCart = function() {
      return cart;
    };
    self.addToCart = function(product, quantity) {
      var deferred = $q.defer();
      var existingItem = cart.find(function(item) { return item.productId === product.productId; });
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          cartItemId: 'ci-' + Date.now(),
          productId: product.productId,
          productName: product.name,
          quantity: quantity,
          price: product.price,
          imageUrl: product.imageUrl
        });
      }
      $rootScope.$broadcast('cart:updated', cart);
      setTimeout(function() {
        deferred.resolve(cart);
      }, 200);
      return deferred.promise;
    };
    self.removeFromCart = function(cartItemId) {
      cart = cart.filter(function(item) { return item.cartItemId !== cartItemId; });
      $rootScope.$broadcast('cart:updated', cart);
    };
    self.updateQuantity = function(cartItemId, quantity) {
      var item = cart.find(function(item) { return item.cartItemId === cartItemId; });
      if (item) {
        item.quantity = quantity;
        $rootScope.$broadcast('cart:updated', cart);
      }
    };
    self.clearCart = function() {
      cart = [];
      $rootScope.$broadcast('cart:updated', cart);
    };
    self.getCartCount = function() {
      return cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    };
    self.getCartTotal = function() {
      return cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    };
  }
})();