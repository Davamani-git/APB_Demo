angular.module('fraudDetectionApp').service('FraudRiskService', ['$http', '$q', 'TransactionIngestionService', function($http, $q, TransactionIngestionService) {
  var self = this;
  var API_BASE = '/api/fraud-risk';

  this.calculateRiskScore = function(transactionEvent) {
    if (!transactionEvent || !transactionEvent.transactionId) {
      return $q.reject({ error: 'Invalid transaction for risk calculation' });
    }
    var signals = self.evaluateSignals(transactionEvent);
    var payload = {
      transactionId: transactionEvent.transactionId,
      transaction: transactionEvent,
      signals: signals
    };
    return $http.post(API_BASE + '/calculate', payload).then(function(response) {
      return {
        transactionId: transactionEvent.transactionId,
        riskScore: response.data.riskScore,
        signals: signals,
        timestamp: new Date()
      };
    });
  };

  this.evaluateSignals = function(transaction) {
    var signals = {
      amountAnomaly: false,
      geoInconsistency: false,
      velocityPattern: 'normal',
      failedAttempts: 0,
      compromisedCard: false
    };
    if (transaction.amount > 5000) {
      signals.amountAnomaly = true;
    }
    if (transaction.location && transaction.location.country) {
      var suspiciousCountries = ['XX', 'YY'];
      if (suspiciousCountries.indexOf(transaction.location.country) !== -1) {
        signals.geoInconsistency = true;
      }
    }
    if (transaction.deviceInfo && transaction.deviceInfo.newDevice) {
      signals.velocityPattern = 'suspicious';
    }
    if (transaction.authorizationStatus === 'failed') {
      signals.failedAttempts = 1;
    }
    return signals;
  };

  this.getRiskScoreById = function(transactionId) {
    return $http.get(API_BASE + '/score/' + transactionId).then(function(response) {
      return response.data;
    });
  };
}]);