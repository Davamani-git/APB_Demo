(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('CheckoutController', ['paymentService', 'orderService', 'cartService', '$scope', '$location', function(paymentService, orderService, cartService, $scope, $location) {
      var vm = this;
      vm.cartItems = [];
      vm.total = 0;
      vm.paymentData = {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      };
      vm.shippingAddress = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      };
      vm.processing = false;
      vm.loadCheckout = function() {
        vm.cartItems = cartService.getCart();
        vm.total = cartService.getCartTotal();
        if (vm.cartItems.length === 0) {
          toastr.warning('Your cart is empty');
          $location.path('/products');
        }
      };
      vm.submitCheckout = function() {
        if (!vm.validateForm()) {
          return;
        }
        if (!paymentService.validatePaymentMethod(vm.paymentData)) {
          toastr.error('Invalid or expired payment method. Please update your payment details.');
          return;
        }
        vm.processing = true;
        var paymentRequest = {
          amount: vm.total,
          cardNumber: vm.paymentData.cardNumber,
          expiryDate: vm.paymentData.expiryDate,
          cvv: vm.paymentData.cvv,
          cardholderName: vm.paymentData.cardholderName
        };
        paymentService.processPayment(paymentRequest).then(function(paymentResponse) {
          var orderData = {
            items: vm.cartItems,
            totalAmount: vm.total,
            paymentMethod: 'Credit Card',
            shippingAddress: vm.shippingAddress,
            paymentId: paymentResponse.paymentId
          };
          return orderService.createOrder(orderData);
        }).then(function(orderResponse) {
          return cartService.clearCart().then(function() {
            return orderResponse;
          });
        }).then(function(orderResponse) {
          vm.processing = false;
          toastr.success('Order placed successfully! Order ID: ' + orderResponse.orderId);
          $location.path('/products');
        }, function(error) {
          vm.processing = false;
          var errorMsg = typeof error === 'string' ? error : 'Checkout failed. Please try again.';
          toastr.error(errorMsg);
        });
      };
      vm.validateForm = function() {
        if (!vm.paymentData.cardNumber || !vm.paymentData.expiryDate || !vm.paymentData.cvv || !vm.paymentData.cardholderName) {
          toastr.error('Please fill in all payment details');
          return false;
        }
        if (!vm.shippingAddress.street || !vm.shippingAddress.city || !vm.shippingAddress.state || !vm.shippingAddress.zipCode) {
          toastr.error('Please fill in all shipping address fields');
          return false;
        }
        return true;
      };
      vm.loadCheckout();
    }]);
})();