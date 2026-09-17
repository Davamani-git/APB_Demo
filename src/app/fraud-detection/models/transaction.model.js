angular.module('fraudDetectionModule').factory('TransactionModel', [function() {
  class Transaction {
    constructor(data) {
      if (!data || !data.transactionId || !data.cardId || typeof data.amount !== 'number') {
        throw new Error('Invalid transaction data');
      }
      this.transactionId = data.transactionId;
      this.cardId = data.cardId;
      this.amount = data.amount;
      this.currency = data.currency || 'USD';
      this.merchantId = data.merchantId;
      this.merchantName = data.merchantName;
      this.merchantCategory = data.merchantCategory;
      this.timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
      this.location = data.location || {};
      this.authorizationStatus = data.authorizationStatus || 'pending';
    }
    validate() {
      return this.transactionId && this.cardId && this.amount > 0;
    }
  }
  return Transaction;
}]);