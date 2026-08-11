(function() {
  'use strict';
  angular.module('onlineShoppingApp').controller('CartController', ['CartService', 'ToastFactory', '$scope', '$location', CartController]);
  function CartController(CartService, ToastFactory, $scope, $location) {
    var vm = this;
    vm.cartItems = [];
    vm.total = 0;
    vm.loadCart = function() {
      vm.cartItems = CartService.getCart();
      vm.total = CartService.getCartTotal();
    };
    vm.updateQuantity = function(item) {
      if (item.quantity < 1) {
        item.quantity = 1;
      }
      CartService.updateQuantity(item.cartItemId, item.quantity);
      vm.total = CartService.getCartTotal();
    };
    vm.removeItem = function(cartItemId) {
      CartService.removeFromCart(cartItemId);
      vm.loadCart();
      ToastFactory.success('Item removed from cart');
    };
    vm.proceedToCheckout = function() {
      if (vm.cartItems.length === 0) {
        ToastFactory.warning('Cart is empty');
        return;
      }
      $location.path('/checkout');
    };
    vm.loadCart();
  }
})();