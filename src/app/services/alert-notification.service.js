angular.module('fraudDetection').service('AlertNotificationService', ['$http', '$q', '$rootScope', 'AuditLogService', function($http, $q, $rootScope, AuditLogService) {
  var API_BASE = '/api';
  var activeAlerts = [];
  
  this.createAlert = function(transaction, riskScore, policyDecision) {
    if (!policyDecision.requiresAlert) {
      return $q.resolve({message: 'No alert required'});
    }
    var alert = {
      alertId: 'ALT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      transactionId: transaction.transactionId,
      riskLevel: riskScore.riskLevel,
      riskScore: riskScore.overallScore,
      actionTaken: policyDecision.action,
      status: 'pending',
      createdAt: new Date(),
      transaction: {
        amount: transaction.amount,
        currency: transaction.currency,
        merchantName: transaction.merchantName,
        cardNumber: transaction.cardNumber,
        timestamp: transaction.timestamp,
        location: transaction.location
      }
    };
    return $http.post(API_BASE + '/alerts/create', alert).then(function(response) {
      activeAlerts.push(alert);
      $rootScope.$broadcast('fraud-alert-created', alert);
      AuditLogService.logEvent('alert_created', {
        alertId: alert.alertId,
        transactionId: transaction.transactionId,
        riskLevel: riskScore.riskLevel
      });
      return alert;
    }).catch(function(error) {
      AuditLogService.logEvent('alert_creation_failed', {
        transactionId: transaction.transactionId,
        error: error
      });
      return $q.reject(error);
    });
  };
  
  this.getActiveAlerts = function() {
    return activeAlerts;
  };
  
  this.acknowledgeAlert = function(alertId) {
    return $http.post(API_BASE + '/alerts/' + alertId + '/acknowledge').then(function(response) {
      var alert = activeAlerts.find(function(a) { return a.alertId === alertId; });
      if (alert) {
        alert.status = 'acknowledged';
      }
      $rootScope.$broadcast('fraud-alert-acknowledged', alertId);
      AuditLogService.logEvent('alert_acknowledged', {alertId: alertId});
      return response.data;
    });
  };
  
  this.resolveAlert = function(alertId, resolution) {
    return $http.post(API_BASE + '/alerts/' + alertId + '/resolve', {resolution: resolution}).then(function(response) {
      var index = activeAlerts.findIndex(function(a) { return a.alertId === alertId; });
      if (index !== -1) {
        activeAlerts[index].status = 'resolved';
        activeAlerts[index].resolution = resolution;
      }
      $rootScope.$broadcast('fraud-alert-resolved', {alertId: alertId, resolution: resolution});
      AuditLogService.logEvent('alert_resolved', {alertId: alertId, resolution: resolution});
      return response.data;
    });
  };
  
  this.sendNotification = function(alert, channel) {
    var payload = {
      alertId: alert.alertId,
      channel: channel || 'push',
      message: 'Fraud alert for transaction ' + alert.transactionId
    };
    return $http.post(API_BASE + '/notifications/send', payload).then(function(response) {
      AuditLogService.logEvent('notification_sent', {
        alertId: alert.alertId,
        channel: channel
      });
      return response.data;
    }).catch(function(error) {
      AuditLogService.logEvent('notification_failed', {
        alertId: alert.alertId,
        channel: channel,
        error: error
      });
      return $q.reject(error);
    });
  };
}]);