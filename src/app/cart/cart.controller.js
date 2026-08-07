(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('CartController', ['cartService', '$scope', function(cartService, $scope) {
      var vm = this;
      vm.cartItems = [];
      vm.total = 0;
      vm.loadCart = function() {
        vm.cartItems = cartService.getCart();
        vm.total = cartService.getCartTotal();
      };
      vm.updateQuantity = function(item) {
        if (item.quantity < 1) {
          item.quantity = 1;
        }
        cartService.updateQuantity(item.cartItemId, item.quantity).then(function() {
          vm.loadCart();
        });
      };
      vm.removeItem = function(cartItemId) {
        cartService.removeItem(cartItemId).then(function() {
          vm.loadCart();
          toastr.success('Item removed from cart');
        });
      };
      vm.loadCart();
    }]);
})();