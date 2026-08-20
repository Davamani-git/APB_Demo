(function() {
  'use strict';
  angular.module('fraudDetection')
    .factory('FraudModels', [function() {
      function Transaction(data) {
        this.transactionId = data.transactionId || null;
        this.accountId = data.accountId || null;
        this.cardId = data.cardId || null;
        this.merchant = data.merchant || '';
        this.amount = data.amount || 0;
        this.currency = data.currency || 'USD';
        this.timestamp = data.timestamp || new Date();
        this.channel = data.channel || 'unknown';
        this.location = data.location || {};
        this.deviceId = data.deviceId || null;
        this.idempotencyKey = data.idempotencyKey || null;
      }
      function RiskDecision(data) {
        this.decisionId = data.decisionId || null;
        this.transactionId = data.transactionId || null;
        this.riskScore = data.riskScore || 0;
        this.riskBand = data.riskBand || 'low';
        this.modelVersion = data.modelVersion || '1.0';
        this.decision = data.decision || 'approve';
        this.signals = data.signals || {};
        this.timestamp = data.timestamp || new Date();
      }
      function Alert(data) {
        this.alertId = data.alertId || null;
        this.transactionId = data.transactionId || null;
        this.customerId = data.customerId || null;
        this.severity = data.severity || 'low';
        this.status = data.status || 'created';
        this.transaction = data.transaction || null;
        this.riskMessage = data.riskMessage || '';
        this.createdAt = data.createdAt || new Date();
        this.expiresAt = data.expiresAt || null;
        this.viewedAt = data.viewedAt || null;
        this.respondedAt = data.respondedAt || null;
      }
      function CustomerResponse(data) {
        this.responseId = data.responseId || null;
        this.alertId = data.alertId || null;
        this.customerId = data.customerId || null;
        this.response = data.response || null;
        this.authenticatedAt = data.authenticatedAt || null;
        this.timestamp = data.timestamp || new Date();
      }
      function FraudCase(data) {
        this.caseId = data.caseId || null;
        this.alertId = data.alertId || null;
        this.caseType = data.caseType || '';
        this.protectionAction = data.protectionAction || '';
        this.status = data.status || 'started';
        this.createdAt = data.createdAt || new Date();
        this.completedAt = data.completedAt || null;
      }
      function AuditRecord(data) {
        this.auditId = data.auditId || null;
        this.eventType = data.eventType || '';
        this.alertId = data.alertId || null;
        this.transactionId = data.transactionId || null;
        this.modelVersion = data.modelVersion || '1.0';
        this.payload = data.payload || {};
        this.timestamp = data.timestamp || new Date();
      }
      return {
        Transaction: Transaction,
        RiskDecision: RiskDecision,
        Alert: Alert,
        CustomerResponse: CustomerResponse,
        FraudCase: FraudCase,
        AuditRecord: AuditRecord
      };
    }]);
})();