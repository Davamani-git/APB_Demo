angular.module('fraudDetectionApp').service('auditService', ['$http', '$log', function($http, $log) {
  const API_BASE = '/api/audit';
  
  this.logRiskDecision = function(transaction, riskDecision) {
    const auditEntry = {
      eventType: 'RISK_DECISION',
      transactionId: transaction.transactionId,
      riskScore: riskDecision.riskScore,
      riskLevel: riskDecision.riskLevel,
      alertTriggered: riskDecision.alertTriggered,
      decisionReason: riskDecision.decisionReason,
      timestamp: new Date().toISOString()
    };
    
    this.sendAuditLog(auditEntry);
  };
  
  this.logError = function(message, details) {
    const auditEntry = {
      eventType: 'ERROR',
      message: message,
      details: details,
      timestamp: new Date().toISOString()
    };
    
    $log.error(message, details);
    this.sendAuditLog(auditEntry);
  };
  
  this.logInfo = function(message, details) {
    const auditEntry = {
      eventType: 'INFO',
      message: message,
      details: details,
      timestamp: new Date().toISOString()
    };
    
    $log.info(message, details);
    this.sendAuditLog(auditEntry);
  };
  
  this.sendAuditLog = function(auditEntry) {
    $http.post(API_BASE, auditEntry)
      .catch(error => {
        $log.error('Failed to send audit log', error);
      });
  };
}]);