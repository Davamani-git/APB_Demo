(function() {
  'use strict';
  angular.module('app.shopping')
    .service('PaymentService', ['$http', '$q', 'API_BASE_URL', function($http, $q, API_BASE_URL) {
      var self = this;
      self.processPayment = function(paymentDetails) {
        return $http.post(API_BASE_URL + '/payment/process', paymentDetails)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.validatePaymentDetails = function(paymentDetails) {
        var errors = [];
        if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 13) {
          errors.push('Invalid card number');
        }
        if (!paymentDetails.expiryDate) {
          errors.push('Expiry date is required');
        }
        if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) {
          errors.push('Invalid CVV');
        }
        if (!paymentDetails.cardHolderName) {
          errors.push('Cardholder name is required');
        }
        return errors.length === 0 ? null : errors;
      };
      self.getSupportedPaymentMethods = function() {
        return $http.get(API_BASE_URL + '/payment/methods')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
    }]);
})();