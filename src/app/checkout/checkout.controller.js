(function() {
  'use strict';
  angular.module('app.shopping')
    .controller('CheckoutController', ['$scope', '$location', 'CartService', 'PaymentService', 'OrderService', 'NotificationService', function($scope, $location, CartService, PaymentService, OrderService, NotificationService) {
      var vm = this;
      vm.cart = {};
      vm.paymentDetails = {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        paymentMethod: 'credit_card'
      };
      vm.shippingAddress = {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      };
      vm.processing = false;
      vm.error = null;
      vm.validationErrors = [];
      vm.init = function() {
        vm.loadCart();
      };
      vm.loadCart = function() {
        CartService.getCart()
          .then(function(data) {
            vm.cart = data;
            if (!vm.cart.items || vm.cart.items.length === 0) {
              NotificationService.showNotification('Your cart is empty', 'warning');
              $location.path('/cart');
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load cart';
            NotificationService.showNotification('Error loading cart', 'error');
          });
      };
      vm.validateForm = function() {
        vm.validationErrors = [];
        if (!vm.shippingAddress.street || !vm.shippingAddress.city || !vm.shippingAddress.state || !vm.shippingAddress.zip || !vm.shippingAddress.country) {
          vm.validationErrors.push('All shipping address fields are required');
        }
        var paymentErrors = PaymentService.validatePaymentDetails(vm.paymentDetails);
        if (paymentErrors) {
          vm.validationErrors = vm.validationErrors.concat(paymentErrors);
        }
        return vm.validationErrors.length === 0;
      };
      vm.processCheckout = function() {
        if (!vm.validateForm()) {
          NotificationService.showNotification('Please fix validation errors', 'error');
          return;
        }
        vm.processing = true;
        vm.error = null;
        PaymentService.processPayment(vm.paymentDetails)
          .then(function(paymentResponse) {
            return OrderService.createOrder(vm.cart, {
              paymentId: paymentResponse.paymentId,
              paymentMethod: vm.paymentDetails.paymentMethod,
              shippingAddress: vm.shippingAddress
            });
          })
          .then(function(orderResponse) {
            vm.processing = false;
            NotificationService.showNotification('Order placed successfully!', 'success');
            CartService.clearCart();
            $location.path('/orders');
          })
          .catch(function(error) {
            vm.processing = false;
            vm.error = error.data && error.data.message ? error.data.message : 'Payment failed. Please check your payment details and try again.';
            NotificationService.showNotification(vm.error, 'error');
          });
      };
      vm.init();
    }]);
})();