angular.module('fraudDetection').controller('FraudAlertController', ['$scope', 'PolicyDecisionService', 'AlertNotificationService', 'AuditLogService', function($scope, PolicyDecisionService, AlertNotificationService, AuditLogService) {
  var vm = this;
  vm.alerts = [];
  
  vm.init = function() {
    vm.loadAlerts();
    vm.subscribeToAlertEvents();
  };
  
  vm.loadAlerts = function() {
    vm.alerts = AlertNotificationService.getActiveAlerts();
  };
  
  vm.confirmTransaction = function(alert) {
    AlertNotificationService.resolveAlert(alert.alertId, 'confirmed_legitimate').then(function() {
      vm.loadAlerts();
    }).catch(function(error) {
      alert.status = 'resolved';
      alert.resolution = 'confirmed_legitimate';
    });
  };
  
  vm.reportTransaction = function(alert) {
    AlertNotificationService.resolveAlert(alert.alertId, 'reported_fraud').then(function() {
      vm.triggerProtectionWorkflow(alert);
      vm.loadAlerts();
    }).catch(function(error) {
      alert.status = 'resolved';
      alert.resolution = 'reported_fraud';
      vm.triggerProtectionWorkflow(alert);
    });
  };
  
  vm.triggerProtectionWorkflow = function(alert) {
    AuditLogService.logEvent('protection_workflow_triggered', {
      alertId: alert.alertId,
      transactionId: alert.transactionId
    });
  };
  
  vm.subscribeToAlertEvents = function() {
    $scope.$on('fraud-alert-created', function(event, alert) {
      vm.loadAlerts();
    });
    $scope.$on('fraud-alert-resolved', function(event, data) {
      vm.loadAlerts();
    });
  };
  
  vm.init();
}]);