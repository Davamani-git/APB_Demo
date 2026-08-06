(function() {
  'use strict';
  angular.module('shoppingPlatform').service('PaymentGatewayService', ['$http', '$q', 'PaymentFactory', 'FraudDetectionService', 'API_CONFIG', 'PAYMENT_CONFIG', function($http, $q, PaymentFactory, FraudDetectionService, API_CONFIG, PAYMENT_CONFIG) {
    this.processPayment = function(paymentData) {
      return PaymentFactory.tokenizePayment(paymentData).then(function(token) {
        var transactionData = {
          token: token,
          amount: paymentData.amount,
          currency: paymentData.currency,
          method: paymentData.method
        };
        return FraudDetectionService.checkFraudScore(transactionData);
      }).then(function(fraudResult) {
        if (!fraudResult.approved) {
          return $q.reject({ error: fraudResult.reason });
        }
        return this.chargePayment(paymentData);
      }.bind(this));
    };
    this.chargePayment = function(paymentData) {
      return $http.post(API_CONFIG.baseUrl + '/api/payments/charge', paymentData, { timeout: API_CONFIG.timeout }).then(function(response) {
        if (response.data.status === 'success') {
          return {
            success: true,
            paymentId: response.data.paymentId,
            transactionId: response.data.transactionId
          };
        } else {
          return {
            success: false,
            error: response.data.error || 'Payment processing failed'
          };
        }
      }).catch(function(error) {
        return {
          success: false,
          error: error.data && error.data.message ? error.data.message : 'Payment gateway error'
        };
      });
    };
    this.refundPayment = function(paymentId, amount) {
      return $http.post(API_CONFIG.baseUrl + '/api/payments/refund', {
        paymentId: paymentId,
        amount: amount
      }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();