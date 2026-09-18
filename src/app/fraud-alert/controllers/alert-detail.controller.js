(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .controller('alertDetailController', ['$scope', '$routeParams', 'alertRecordService', 'auditService', function($scope, $routeParams, alertRecordService, auditService) {
      const vm = this;
      vm.alert = null;
      vm.auditLogs = [];
      vm.loading = true;
      vm.error = null;
      vm.notes = '';
      
      vm.init = function() {
        const alertId = $routeParams.alertId;
        vm.loadAlert(alertId);
        vm.loadAuditLogs();
      };
      
      vm.loadAlert = function(alertId) {
        alertRecordService.getAlertById(alertId)
          .then(function(alert) {
            vm.alert = alert;
            vm.notes = alert.notes || '';
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load alert details';
            vm.loading = false;
          });
      };
      
      vm.loadAuditLogs = function() {
        if (vm.alert && vm.alert.transactionId) {
          auditService.getAuditLogs(vm.alert.transactionId)
            .then(function(logs) {
              vm.auditLogs = logs;
            })
            .catch(function(error) {
              console.error('Failed to load audit logs:', error);
            });
        }
      };
      
      vm.updateAlert = function() {
        const updates = {
          status: vm.alert.status,
          notes: vm.notes,
          reviewedBy: 'current_user'
        };
        
        alertRecordService.updateAlert(vm.alert.alertId, updates)
          .then(function(updatedAlert) {
            vm.alert = updatedAlert;
            vm.successMessage = 'Alert updated successfully';
            
            auditService.logDecision({
              transactionId: vm.alert.transactionId,
              eventType: 'alert_updated',
              payload: updates
            });
          })
          .catch(function(error) {
            vm.error = 'Failed to update alert';
          });
      };
      
      vm.getRiskClass = function(level) {
        const classes = {
          low: 'success',
          medium: 'warning',
          high: 'danger',
          confirmed_fraud: 'danger'
        };
        return classes[level] || 'default';
      };
      
      vm.formatDate = function(date) {
        return new Date(date).toLocaleString();
      };
      
      vm.init();
    }]);
})();