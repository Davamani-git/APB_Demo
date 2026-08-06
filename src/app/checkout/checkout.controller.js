(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('CheckoutController', ['$scope', '$location', 'CheckoutService', 'PaymentGatewayService', 'CartService', 'OrderService', 'NotificationService', function($scope, $location, CheckoutService, PaymentGatewayService, CartService, OrderService, NotificationService) {
    var vm = this;
    vm.checkoutData = null;
    vm.loading = false;
    vm.processing = false;
    vm.paymentMethod = 'credit_card';
    vm.paymentDetails = {
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    };
    vm.shippingAddress = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    vm.init = function() {
      vm.loadCheckoutData();
    };
    vm.loadCheckoutData = function() {
      vm.loading = true;
      CheckoutService.getCheckoutData().then(function(data) {
        vm.checkoutData = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load checkout data.');
        console.error('Error loading checkout:', error);
      });
    };
    vm.submitPayment = function() {
      if (!vm.validateForm()) {
        return;
      }
      vm.processing = true;
      var paymentData = {
        method: vm.paymentMethod,
        details: vm.paymentDetails,
        amount: vm.checkoutData.total,
        currency: 'USD'
      };
      PaymentGatewayService.processPayment(paymentData).then(function(paymentResult) {
        if (paymentResult.success) {
          var orderData = {
            items: vm.checkoutData.items,
            totalAmount: vm.checkoutData.total,
            paymentMethod: vm.paymentMethod,
            paymentId: paymentResult.paymentId,
            shippingAddress: vm.shippingAddress
          };
          return OrderService.createOrder(orderData);
        } else {
          throw new Error(paymentResult.error || 'Payment failed');
        }
      }).then(function(order) {
        NotificationService.sendOrderConfirmation(order.orderId);
        CartService.clearCart();
        vm.processing = false;
        alert('Order placed successfully! Order ID: ' + order.orderId);
        $location.path('/orders');
      }).catch(function(error) {
        vm.processing = false;
        alert('Payment failed: ' + (error.message || 'Please try again.'));
        console.error('Payment error:', error);
      });
    };
    vm.validateForm = function() {
      if (!vm.shippingAddress.street || !vm.shippingAddress.city || !vm.shippingAddress.zipCode) {
        alert('Please fill in all shipping address fields.');
        return false;
      }
      if (vm.paymentMethod === 'credit_card') {
        if (!vm.paymentDetails.cardNumber || !vm.paymentDetails.cardName || !vm.paymentDetails.cvv) {
          alert('Please fill in all payment details.');
          return false;
        }
      }
      return true;
    };
    vm.init();
  }]);
})();