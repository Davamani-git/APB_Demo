(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .controller('alertDashboardController', ['$scope', '$filter', 'alertRecordService', 'transactionIngestionService', 'policyDecisionService', function($scope, $filter, alertRecordService, transactionIngestionService, policyDecisionService) {
      const vm = this;
      vm.alerts = [];
      vm.filteredAlerts = [];
      vm.loading = true;
      vm.error = null;
      vm.searchText = '';
      vm.statusFilter = 'all';
      vm.currentPage = 1;
      vm.itemsPerPage = 10;
      
      vm.init = function() {
        vm.loadAlerts();
        vm.startMonitoring();
      };
      
      vm.loadAlerts = function() {
        vm.loading = true;
        alertRecordService.getAlerts()
          .then(function(alerts) {
            vm.alerts = alerts;
            vm.applyFilters();
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load alerts';
            vm.loading = false;
          });
      };
      
      vm.startMonitoring = function() {
        transactionIngestionService.startPolling(function(transactions) {
          transactions.forEach(function(transaction) {
            policyDecisionService.processTransaction(transaction)
              .then(function(result) {
                if (result.alert) {
                  vm.loadAlerts();
                }
              });
          });
        }, 15000);
      };
      
      vm.applyFilters = function() {
        let filtered = vm.alerts;
        
        if (vm.statusFilter !== 'all') {
          filtered = $filter('filter')(filtered, { status: vm.statusFilter });
        }
        
        if (vm.searchText) {
          filtered = $filter('filter')(filtered, vm.searchText);
        }
        
        vm.filteredAlerts = filtered;
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
      
      vm.updateStatus = function(alert, newStatus) {
        alertRecordService.updateAlert(alert.alertId, { status: newStatus })
          .then(function() {
            alert.status = newStatus;
            vm.applyFilters();
          })
          .catch(function(error) {
            vm.error = 'Failed to update alert status';
          });
      };
      
      $scope.$watch('vm.searchText', vm.applyFilters);
      $scope.$watch('vm.statusFilter', vm.applyFilters);
      
      $scope.$on('$destroy', function() {
        transactionIngestionService.stopPolling();
      });
      
      vm.init();
    }]);
})();