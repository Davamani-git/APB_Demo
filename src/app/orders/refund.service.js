(function() {
  'use strict';
  angular.module('shoppingPlatform').service('RefundService', ['$http', 'PaymentGatewayService', 'API_CONFIG', function($http, PaymentGatewayService, API_CONFIG) {
    this.requestRefund = function(orderId, amount, reason) {
      return $http.post(API_CONFIG.baseUrl + '/api/refunds', {
        orderId: orderId,
        amount: amount,
        reason: reason
      }, { timeout: API_CONFIG.timeout }).then(function(response) {
        var refundData = response.data;
        if (refundData.paymentId) {
          return PaymentGatewayService.refundPayment(refundData.paymentId, amount);
        }
        return refundData;
      });
    };
    this.getRefundStatus = function(refundId) {
      return $http.get(API_CONFIG.baseUrl + '/api/refunds/' + refundId, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();