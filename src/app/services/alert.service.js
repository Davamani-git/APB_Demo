angular.module('fraudDetectionApp').service('AlertService', ['$http', '$q', 'PolicyDecisionService', 'NotificationService', function($http, $q, PolicyDecisionService, NotificationService) {
  var self = this;
  var API_BASE = '/api/alerts';

  this.createAlert = function(policyDecision, customerId) {
    if (!policyDecision || !policyDecision.transactionId) {
      return $q.reject({ error: 'Invalid policy decision' });
    }
    var shouldAlert = ['alert', 'step-up', 'hold', 'decline'].indexOf(policyDecision.action) !== -1;
    if (!shouldAlert) {
      return $q.resolve({ alertCreated: false, reason: 'Action does not require alert' });
    }
    var alert = {
      alertId: 'ALT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      transactionId: policyDecision.transactionId,
      customerId: customerId || 'CUST-UNKNOWN',
      riskScore: policyDecision.riskScore,
      action: policyDecision.action,
      status: 'pending',
      createdAt: new Date(),
      notificationChannels: ['push', 'email']
    };
    return $http.post(API_BASE, alert).then(function(response) {
      var createdAlert = response.data;
      return self.sendNotification(createdAlert).then(function(notificationResult) {
        return { alert: createdAlert, notification: notificationResult };
      });
    });
  };

  this.sendNotification = function(alert) {
    return NotificationService.send({
      alertId: alert.alertId,
      customerId: alert.customerId,
      channels: alert.notificationChannels,
      message: 'Suspicious transaction detected. Please review.',
      priority: alert.action === 'decline' ? 'high' : 'medium'
    });
  };

  this.getAlerts = function(filters) {
    return $http.get(API_BASE, { params: filters }).then(function(response) {
      return response.data;
    });
  };

  this.getAlertById = function(alertId) {
    return $http.get(API_BASE + '/' + alertId).then(function(response) {
      return response.data;
    });
  };

  this.updateAlertStatus = function(alertId, status) {
    return $http.patch(API_BASE + '/' + alertId, { status: status }).then(function(response) {
      return response.data;
    });
  };

  this.confirmTransaction = function(alertId, customerId) {
    return $http.post(API_BASE + '/' + alertId + '/confirm', { customerId: customerId }).then(function(response) {
      return self.updateAlertStatus(alertId, 'confirmed').then(function() {
        return response.data;
      });
    });
  };

  this.reportTransaction = function(alertId, customerId) {
    return $http.post(API_BASE + '/' + alertId + '/report', { customerId: customerId }).then(function(response) {
      return self.updateAlertStatus(alertId, 'reported').then(function() {
        return self.triggerProtectionWorkflow(alertId, customerId);
      });
    });
  };

  this.triggerProtectionWorkflow = function(alertId, customerId) {
    return $http.post('/api/protection/initiate', { alertId: alertId, customerId: customerId }).then(function(response) {
      return response.data;
    });
  };
}]);