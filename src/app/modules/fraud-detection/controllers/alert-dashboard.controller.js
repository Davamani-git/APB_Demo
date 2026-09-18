(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .controller('AlertDashboardController', ['$scope', '$filter', 'AlertCreationService', function($scope, $filter, AlertCreationService) {
      const vm = this;
      
      vm.alerts = [];
      vm.filteredAlerts = [];
      vm.filters = {
        search: '',
        severity: '',
        status: ''
      };
      vm.metrics = {
        total: 0,
        critical: 0,
        high: 0,
        resolved: 0
      };
      
      vm.refreshAlerts = function() {
        AlertCreationService.getAlerts(vm.filters)
          .then(function(alerts) {
            vm.alerts = alerts;
            vm.applyFilters();
            vm.calculateMetrics();
          })
          .catch(function(error) {
            console.error('Failed to load alerts:', error);
          });
      };
      
      vm.applyFilters = function() {
        vm.filteredAlerts = vm.alerts;
        
        if (vm.filters.search) {
          vm.filteredAlerts = $filter('filter')(vm.filteredAlerts, function(alert) {
            return alert.transaction_id.indexOf(vm.filters.search) !== -1 ||
                   alert.customer_id.indexOf(vm.filters.search) !== -1;
          });
        }
        
        if (vm.filters.severity) {
          vm.filteredAlerts = $filter('filter')(vm.filteredAlerts, { severity: vm.filters.severity });
        }
        
        if (vm.filters.status) {
          vm.filteredAlerts = $filter('filter')(vm.filteredAlerts, { status: vm.filters.status });
        }
      };
      
      vm.calculateMetrics = function() {
        vm.metrics.total = vm.alerts.length;
        vm.metrics.critical = $filter('filter')(vm.alerts, { severity: 'critical' }).length;
        vm.metrics.high = $filter('filter')(vm.alerts, { severity: 'high' }).length;
        vm.metrics.resolved = $filter('filter')(vm.alerts, { status: 'resolved' }).length;
      };
      
      $scope.$watch('dashCtrl.filters', function() {
        vm.applyFilters();
      }, true);
      
      $scope.$on('alert-created', function(event, alert) {
        vm.refreshAlerts();
      });
      
      vm.refreshAlerts();
    }]);
})();