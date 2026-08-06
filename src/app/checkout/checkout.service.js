(function() {
  'use strict';
  angular.module('shoppingPlatform').service('CheckoutService', ['$http', '$q', 'CartService', 'API_CONFIG', function($http, $q, CartService, API_CONFIG) {
    this.getCheckoutData = function() {
      return CartService.getCart().then(function(items) {
        var total = items.reduce(function(sum, item) {
          return sum + (item.price * item.quantity);
        }, 0);
        return {
          items: items,
          total: total,
          itemCount: items.length
        };
      });
    };
    this.validateCart = function() {
      return this.getCheckoutData().then(function(data) {
        if (data.items.length === 0) {
          return $q.reject('Cart is empty');
        }
        return data;
      });
    };
  }]);
})();