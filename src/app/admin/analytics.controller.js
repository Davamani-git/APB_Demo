(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
    var vm = this;
    vm.analyticsData = {};
    vm.loading = false;
    vm.chartData = null;
    vm.init = function() {
      vm.loading = true;
      AnalyticsService.getPlatformMetrics().then(function(data) {
        vm.analyticsData = data;
        vm.prepareChartData();
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load analytics.');
        console.error('Error loading analytics:', error);
      });
    };
    vm.prepareChartData = function() {
      vm.chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: vm.analyticsData.monthlyRevenue || [0, 0, 0, 0, 0, 0],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    };
    vm.init();
  }]);
})();