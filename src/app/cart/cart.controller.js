(function() {
  'use strict';
  angular.module('app.shopping')
    .controller('CartController', ['$scope', '$location', 'CartService', 'NotificationService', function($scope, $location, CartService, NotificationService) {
      var vm = this;
      vm.cart = {
        items: [],
        totalAmount: 0
      };
      vm.loading = false;
      vm.error = null;
      vm.init = function() {
        vm.loadCart();
      };
      vm.loadCart = function() {
        vm.loading = true;
        vm.error = null;
        CartService.getCart()
          .then(function(data) {
            vm.cart = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load cart. Please try again.';
            vm.loading = false;
            NotificationService.showNotification('Error loading cart', 'error');
          });
      };
      vm.updateQuantity = function(item, quantity) {
        if (quantity < 1) {
          vm.removeItem(item);
          return;
        }
        CartService.updateQuantity(item.productId, quantity)
          .then(function(data) {
            vm.cart = data;
            NotificationService.showNotification('Cart updated', 'success');
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to update cart', 'error');
          });
      };
      vm.removeItem = function(item) {
        CartService.removeItem(item.productId)
          .then(function(data) {
            vm.cart = data;
            NotificationService.showNotification('Item removed from cart', 'success');
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to remove item', 'error');
          });
      };
      vm.clearCart = function() {
        if (confirm('Are you sure you want to clear your cart?')) {
          CartService.clearCart()
            .then(function() {
              vm.cart = { items: [], totalAmount: 0 };
              NotificationService.showNotification('Cart cleared', 'success');
            })
            .catch(function(error) {
              NotificationService.showNotification('Failed to clear cart', 'error');
            });
        }
      };
      vm.proceedToCheckout = function() {
        if (vm.cart.items.length === 0) {
          NotificationService.showNotification('Your cart is empty', 'warning');
          return;
        }
        $location.path('/checkout');
      };
      vm.calculateItemTotal = function(item) {
        return item.price * item.quantity;
      };
      vm.init();
    }]);
})();