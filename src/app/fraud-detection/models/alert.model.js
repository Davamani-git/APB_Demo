angular.module('fraudDetectionModule').factory('AlertModel', [function() {
  class Alert {
    constructor(data) {
      if (!data || !data.transactionId || !data.cardId) {
        throw new Error('Invalid alert data');
      }
      this.alertId = data.alertId || null;
      this.transactionId = data.transactionId;
      this.cardId = data.cardId;
      this.riskScore = data.riskScore || 0;
      this.riskBand = data.riskBand || 'low';
      this.decision = data.decision || 'approve';
      this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
      this.status = data.status || 'pending';
      this.reviewedBy = data.reviewedBy || null;
      this.notes = data.notes || '';
    }
    isHighRisk() {
      return this.riskBand === 'high' || this.riskBand === 'confirmed-fraud';
    }
  }
  return Alert;
}]);