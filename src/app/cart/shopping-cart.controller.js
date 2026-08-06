(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('ShoppingCartController', ['$scope', '$location', 'CartService', 'CartFactory', function($scope, $location, CartService, CartFactory) {
    var vm = this;
    vm.cartItems = [];
    vm.loading = false;
    vm.total = 0;
    vm.init = function() {
      vm.loadCart();
    };
    vm.loadCart = function() {
      vm.loading = true;
      CartService.getCart().then(function(items) {
        vm.cartItems = items;
        vm.calculateTotal();
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load cart.');
        console.error('Error loading cart:', error);
      });
    };
    vm.updateQuantity = function(item) {
      CartService.updateItem(item.productId, item.quantity).then(function() {
        vm.calculateTotal();
        CartFactory.updateCartCount();
      }).catch(function(error) {
        alert('Failed to update quantity.');
        console.error('Error updating quantity:', error);
      });
    };
    vm.removeItem = function(productId) {
      if (confirm('Remove this item from cart?')) {
        CartService.removeItem(productId).then(function() {
          vm.loadCart();
          CartFactory.updateCartCount();
        }).catch(function(error) {
          alert('Failed to remove item.');
          console.error('Error removing item:', error);
        });
      }
    };
    vm.calculateTotal = function() {
      vm.total = vm.cartItems.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
      }, 0);
    };
    vm.proceedToCheckout = function() {
      if (vm.cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
      }
      $location.path('/checkout');
    };
    vm.continueShopping = function() {
      $location.path('/catalog');
    };
    vm.init();
  }]);
})();