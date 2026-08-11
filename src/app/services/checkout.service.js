(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('CheckoutService', ['$http', '$q', CheckoutService]);
  function CheckoutService($http, $q) {
    var self = this;
    var API_BASE = 'https://api.shopping.com';
    self.validateCheckout = function(cartItems) {
      if (!cartItems || cartItems.length === 0) {
        return { valid: false, message: 'Cart is empty' };
      }
      return { valid: true };
    };
    self.submitOrder = function(orderData) {
      var deferred = $q.defer();
      setTimeout(function() {
        var order = {
          orderId: 'ORD-' + Date.now(),
          userId: orderData.userId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          status: 'Confirmed',
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          createdAt: new Date(),
          trackingNumber: 'TRK-' + Date.now()
        };
        deferred.resolve(order);
      }, 1000);
      return deferred.promise;
    };
  }
})();