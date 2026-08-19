angular.module('fraudDetectionApp').controller('AlertController', ['AlertService', '$scope', '$filter', '$interval', function(AlertService, $scope, $filter, $interval) {
  var vm = this;
  vm.alerts = [];
  vm.filteredAlerts = [];
  vm.loading = false;
  vm.error = null;
  vm.filters = {
    status: '',
    searchText: ''
  };

  vm.init = function() {
    vm.loadAlerts();
    var refreshInterval = $interval(function() {
      vm.loadAlerts();
    }, 30000);
    $scope.$on('$destroy', function() {
      $interval.cancel(refreshInterval);
    });
  };

  vm.loadAlerts = function() {
    vm.loading = true;
    vm.error = null;
    AlertService.getAlerts(vm.filters).then(function(alerts) {
      vm.alerts = alerts;
      vm.applyFilters();
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load alerts: ' + (error.data ? error.data.message : error.statusText);
      vm.loading = false;
    });
  };

  vm.applyFilters = function() {
    vm.filteredAlerts = vm.alerts;
    if (vm.filters.status) {
      vm.filteredAlerts = $filter('filter')(vm.filteredAlerts, { status: vm.filters.status });
    }
    if (vm.filters.searchText) {
      vm.filteredAlerts = $filter('filter')(vm.filteredAlerts, vm.filters.searchText);
    }
  };

  vm.confirmTransaction = function(alert) {
    if (!confirm('Are you sure this transaction was made by you?')) {
      return;
    }
    AlertService.confirmTransaction(alert.alertId, alert.customerId).then(function() {
      alert.status = 'confirmed';
      vm.showSuccess('Transaction confirmed successfully');
    }).catch(function(error) {
      vm.error = 'Failed to confirm transaction: ' + (error.data ? error.data.message : error.statusText);
    });
  };

  vm.reportTransaction = function(alert) {
    if (!confirm('Are you sure you want to report this transaction as unauthorized? This will trigger account protection measures.')) {
      return;
    }
    AlertService.reportTransaction(alert.alertId, alert.customerId).then(function() {
      alert.status = 'reported';
      vm.showSuccess('Transaction reported. Account protection initiated.');
    }).catch(function(error) {
      vm.error = 'Failed to report transaction: ' + (error.data ? error.data.message : error.statusText);
    });
  };

  vm.showSuccess = function(message) {
    vm.successMessage = message;
    setTimeout(function() {
      $scope.$apply(function() {
        vm.successMessage = null;
      });
    }, 3000);
  };

  vm.getRiskBadgeClass = function(action) {
    var mapping = {
      'approve': 'risk-low',
      'alert': 'risk-medium',
      'step-up': 'risk-medium',
      'hold': 'risk-high',
      'decline': 'risk-critical'
    };
    return mapping[action] || 'risk-low';
  };

  vm.init();
}]);