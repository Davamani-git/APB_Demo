(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('PaymentService', ['$http', '$q', PaymentService]);
  function PaymentService($http, $q) {
    var self = this;
    var PAYMENT_GATEWAY_API = 'https://payment.gateway.com';
    self.processPayment = function(paymentDetails) {
      var deferred = $q.defer();
      if (!paymentDetails.cardNumber || !paymentDetails.cvv || !paymentDetails.expiryDate) {
        setTimeout(function() {
          deferred.reject({ message: 'Invalid payment details' });
        }, 500);
        return deferred.promise;
      }
      var currentYear = new Date().getFullYear();
      var currentMonth = new Date().getMonth() + 1;
      var expiry = paymentDetails.expiryDate.split('/');
      var expMonth = parseInt(expiry[0]);
      var expYear = parseInt(expiry[1]);
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setTimeout(function() {
          deferred.reject({ message: 'Card expired. Please update payment method.' });
        }, 500);
        return deferred.promise;
      }
      setTimeout(function() {
        deferred.resolve({
          transactionId: 'TXN-' + Date.now(),
          status: 'success',
          amount: paymentDetails.amount
        });
      }, 1500);
      return deferred.promise;
    };
  }
})();