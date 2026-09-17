angular.module('fraudDetectionModule').service('transactionIngestionService', ['$http', '$q', 'fraudRiskFactory', 'policyDecisionService', 'TransactionModel', function($http, $q, fraudRiskFactory, policyDecisionService, TransactionModel) {
  this.processTransaction = function(transactionData) {
    try {
      const transaction = new TransactionModel(transactionData);
      if (!transaction.validate()) {
        return $q.reject({ error: 'Invalid transaction data' });
      }
      return fraudRiskFactory.getRiskScore(transaction).then(function(riskResult) {
        return policyDecisionService.evaluateTransaction(transaction, riskResult).then(function(decision) {
          return {
            transactionId: transaction.transactionId,
            decision: decision.action,
            riskScore: riskResult.score,
            riskBand: riskResult.band
          };
        });
      }).catch(function(error) {
        console.error('Transaction processing failed:', error);
        return $q.reject(error);
      });
    } catch (e) {
      return $q.reject({ error: e.message });
    }
  };
  this.normalizeTransaction = function(rawData) {
    return {
      transactionId: rawData.txnId || rawData.transactionId,
      cardId: rawData.cardNumber || rawData.cardId,
      amount: parseFloat(rawData.amount),
      currency: rawData.currency || 'USD',
      merchantId: rawData.merchant_id || rawData.merchantId,
      merchantName: rawData.merchant_name || rawData.merchantName,
      merchantCategory: rawData.mcc || rawData.merchantCategory,
      timestamp: rawData.timestamp || rawData.txnTime,
      location: rawData.location || {},
      authorizationStatus: rawData.status || 'pending'
    };
  };
}]);