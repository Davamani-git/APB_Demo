angular.module('fraudAlert.ingestion')
  .service('FraudRiskService', ['$http', '$q', 'API_CONFIG', function($http, API_CONFIG, $q) {
    this.evaluateRisk = function(transaction) {
      var riskRequest = {
        transactionId: transaction.transactionId,
        cardNumber: transaction.cardNumber,
        amount: transaction.amount,
        currency: transaction.currency,
        merchantId: transaction.merchantId,
        merchantName: transaction.merchantName,
        merchantCategory: transaction.merchantCategory,
        transactionTimestamp: transaction.transactionTimestamp,
        location: transaction.location,
        deviceId: transaction.deviceId,
        ipAddress: transaction.ipAddress,
        channel: transaction.channel
      };
      return $http.post(API_CONFIG.fraudRiskUrl, riskRequest)
        .then(function(response) {
          var riskEvaluation = {
            transactionId: transaction.transactionId,
            riskScore: response.data.riskScore,
            riskBand: response.data.riskBand,
            signals: response.data.signals || {},
            timestamp: new Date().toISOString()
          };
          return riskEvaluation;
        })
        .catch(function(error) {
          console.error('Fraud risk evaluation failed:', error);
          return {
            transactionId: transaction.transactionId,
            riskScore: 0,
            riskBand: 'unknown',
            signals: {},
            error: error.message,
            timestamp: new Date().toISOString()
          };
        });
    };
  }]);