angular.module('fraudDetectionModule').controller('analyticsController', ['$scope', 'analyticsService', function($scope, analyticsService) {
  var vm = this;
  vm.metrics = {};
  vm.performanceStats = {};
  vm.loading = true;
  vm.error = null;
  vm.loadMetrics = function() {
    vm.loading = true;
    vm.error = null;
    analyticsService.getMetrics().then(function(data) {
      vm.metrics = data;
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load metrics';
      vm.loading = false;
    });
  };
  vm.loadPerformanceStats = function() {
    analyticsService.getPerformanceStats().then(function(data) {
      vm.performanceStats = data;
    }).catch(function(error) {
      console.error('Failed to load performance stats:', error);
    });
  };
  vm.refresh = function() {
    vm.loadMetrics();
    vm.loadPerformanceStats();
  };
  vm.loadMetrics();
  vm.loadPerformanceStats();
}]);