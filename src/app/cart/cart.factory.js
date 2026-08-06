(function() {
  'use strict';
  angular.module('shoppingPlatform').factory('CartFactory', ['$rootScope', 'CartService', function($rootScope, CartService) {
    var cartState = {
      itemCount: 0,
      items: []
    };
    return {
      init: function() {
        this.updateCartCount();
      },
      updateCartCount: function() {
        CartService.getCart().then(function(items) {
          cartState.items = items;
          cartState.itemCount = items.reduce(function(sum, item) {
            return sum + item.quantity;
          }, 0);
          $rootScope.$broadcast('cart:updated', cartState.itemCount);
        });
      },
      getCartState: function() {
        return cartState;
      },
      addItem: function(product, quantity) {
        return CartService.addItem(product, quantity).then(function() {
          this.updateCartCount();
        }.bind(this));
      },
      removeItem: function(productId) {
        return CartService.removeItem(productId).then(function() {
          this.updateCartCount();
        }.bind(this));
      }
    };
  }]);
})();