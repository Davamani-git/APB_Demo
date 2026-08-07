(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('AnalyticsController', ['analyticsService', '$scope', function(analyticsService, $scope) {
      var vm = this;
      vm.sellerId = 'current';
      vm.period = 'monthly';
      vm.metrics = null;
      vm.performanceData = null;
      vm.loadAnalytics = function() {
        analyticsService.getSalesMetrics(vm.sellerId, vm.period).then(function(metrics) {
          vm.metrics = metrics;
        }, function(error) {
          toastr.error('Failed to load sales metrics');
        });
        analyticsService.getPerformanceData(vm.sellerId).then(function(data) {
          vm.performanceData = data;
        }, function(error) {
          toastr.error('Failed to load performance data');
        });
      };
      vm.changePeriod = function(period) {
        vm.period = period;
        vm.loadAnalytics();
      };
      vm.loadAnalytics();
    }]);
})();