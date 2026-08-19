angular.module('fraudDetectionApp').controller('AnalyticsDashboardController', ['AuditService', '$scope', 'ChartService', '$interval', function(AuditService, $scope, ChartService, $interval) {
  var vm = this;
  vm.analytics = null;
  vm.loading = false;
  vm.error = null;
  vm.dateRange = {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  };
  vm.metrics = {
    totalAlerts: 0,
    confirmedFraud: 0,
    falsePositives: 0,
    responseRate: 0
  };

  vm.init = function() {
    vm.loadAnalytics();
    var refreshInterval = $interval(function() {
      vm.loadAnalytics();
    }, 60000);
    $scope.$on('$destroy', function() {
      $interval.cancel(refreshInterval);
    });
  };

  vm.loadAnalytics = function() {
    vm.loading = true;
    vm.error = null;
    AuditService.getAnalytics(vm.dateRange).then(function(analytics) {
      vm.analytics = analytics;
      vm.calculateMetrics();
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load analytics: ' + (error.data ? error.data.message : error.statusText);
      vm.loading = false;
    });
  };

  vm.calculateMetrics = function() {
    if (!vm.analytics || !vm.analytics.alerts) {
      return;
    }
    vm.metrics.totalAlerts = vm.analytics.alerts.length;
    vm.metrics.confirmedFraud = vm.analytics.alerts.filter(function(a) { return a.status === 'reported'; }).length;
    vm.metrics.falsePositives = vm.analytics.alerts.filter(function(a) { return a.status === 'confirmed'; }).length;
    var responded = vm.analytics.alerts.filter(function(a) { return a.status === 'confirmed' || a.status === 'reported'; }).length;
    vm.metrics.responseRate = ChartService.calculatePercentage(responded, vm.metrics.totalAlerts);
  };

  vm.refreshDashboard = function() {
    vm.loadAnalytics();
  };

  vm.exportData = function() {
    var dataStr = JSON.stringify(vm.analytics, null, 2);
    var dataBlob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(dataBlob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'fraud-analytics-' + new Date().toISOString() + '.json';
    link.click();
  };

  vm.init();
}]);