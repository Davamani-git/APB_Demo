(function() {
  'use strict';
  angular.module('onlineShoppingApp').controller('CheckoutController', ['CheckoutService', 'PaymentService', 'OrderService', 'CartService', 'AuthService', 'ToastFactory', '$scope', '$location', CheckoutController]);
  function CheckoutController(CheckoutService, PaymentService, OrderService, CartService, AuthService, ToastFactory, $scope, $location) {
    var vm = this;
    vm.cartItems = [];
    vm.total = 0;
    vm.shippingAddress = { street: '', city: '', state: '', zipCode: '', country: '' };
    vm.paymentDetails = { cardNumber: '', cvv: '', expiryDate: '', cardHolder: '' };
    vm.processing = false;
    vm.loadCheckout = function() {
      vm.cartItems = CartService.getCart();
      vm.total = CartService.getCartTotal();
      var validation = CheckoutService.validateCheckout(vm.cartItems);
      if (!validation.valid) {
        ToastFactory.error(validation.message);
        $location.path('/cart');
      }
    };
    vm.submitOrder = function() {
      if (!vm.shippingAddress.street || !vm.shippingAddress.city || !vm.shippingAddress.zipCode) {
        ToastFactory.error('Please complete shipping address');
        return;
      }
      if (!vm.paymentDetails.cardNumber || !vm.paymentDetails.cvv || !vm.paymentDetails.expiryDate) {
        ToastFactory.error('Please complete payment details');
        return;
      }
      vm.processing = true;
      vm.paymentDetails.amount = vm.total;
      PaymentService.processPayment(vm.paymentDetails).then(function(paymentResult) {
        var user = AuthService.getUser();
        var orderData = {
          userId: user ? user.userId : 'guest',
          items: vm.cartItems,
          totalAmount: vm.total,
          shippingAddress: vm.shippingAddress,
          paymentMethod: 'Credit Card'
        };
        return CheckoutService.submitOrder(orderData);
      }).then(function(order) {
        return OrderService.createOrder(order);
      }).then(function(order) {
        CartService.clearCart();
        ToastFactory.success('Order placed successfully! Order ID: ' + order.orderId);
        vm.processing = false;
        $location.path('/orders/' + order.orderId);
      }).catch(function(error) {
        ToastFactory.error(error.message || 'Payment failed. Please try again.');
        vm.processing = false;
      });
    };
    vm.loadCheckout();
  }
})();