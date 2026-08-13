(function() {
  'use strict';
  angular.module('app.shopping')
    .factory('CartFactory', [function() {
      var cart = {
        userId: null,
        items: [],
        totalAmount: 0
      };
      return {
        getCart: function() {
          return cart;
        },
        setCart: function(newCart) {
          cart.userId = newCart.userId;
          cart.items = newCart.items || [];
          cart.totalAmount = newCart.totalAmount || 0;
        },
        clearCart: function() {
          cart.items = [];
          cart.totalAmount = 0;
        },
        calculateTotal: function() {
          cart.totalAmount = cart.items.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
          }, 0);
          return cart.totalAmount;
        }
      };
    }]);
})();