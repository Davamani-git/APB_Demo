(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('alertNotificationService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      const self = this;
      self.sendAlert = function(transaction, riskBand, riskAssessment) {
        const alertPayload = {
          transactionId: transaction.transactionId,
          cardNumber: transaction.cardNumber,
          amount: transaction.amount,
          currency: transaction.currency,
          merchantName: transaction.merchantName,
          transactionTimestamp: transaction.transactionTimestamp,
          riskBand: riskBand,
          riskScore: riskAssessment.riskScore,
          alertMessage: self.buildAlertMessage(transaction, riskBand)
        };
        return $http.post(apiConfig.baseUrl + apiConfig.endpoints.alertNotify, alertPayload, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
      self.buildAlertMessage = function(transaction, riskBand) {
        const messages = {
          low: 'Transaction processed successfully',
          medium: 'Unusual transaction detected - please verify',
          high: 'Suspicious transaction detected - immediate verification required',
          critical: 'High-risk transaction blocked - account protection activated'
        };
        return messages[riskBand] || 'Transaction requires attention';
      };
    }]);
})();