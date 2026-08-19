angular.module('fraudDetectionApp').factory('transactionModel', [function() {
  function Transaction(data) {
    this.transactionId = data.transactionId || '';
    this.cardNumber = data.cardNumber || '';
    this.amount = data.amount || 0;
    this.currency = data.currency || 'USD';
    this.merchantId = data.merchantId || '';
    this.merchantName = data.merchantName || '';
    this.location = data.location || { latitude: 0, longitude: 0, country: '' };
    this.deviceFingerprint = data.deviceFingerprint || '';
    this.timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    this.idempotencyKey = data.idempotencyKey || '';
  }
  
  Transaction.prototype.validate = function() {
    if (!this.transactionId) return { valid: false, error: 'Transaction ID is required' };
    if (!this.amount || this.amount <= 0) return { valid: false, error: 'Valid amount is required' };
    if (!this.merchantName) return { valid: false, error: 'Merchant name is required' };
    return { valid: true };
  };
  
  Transaction.prototype.maskCardNumber = function() {
    if (this.cardNumber && this.cardNumber.length >= 4) {
      return '****' + this.cardNumber.slice(-4);
    }
    return '****';
  };
  
  return Transaction;
}]);