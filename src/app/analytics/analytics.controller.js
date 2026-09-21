(function() {
  'use strict';
  angular.module('creditCardApp').controller('AnalyticsController', ['AnalyticsService', function(AnalyticsService) {
    var vm = this;
    vm.categoryData = null;
    vm.monthlyData = null;
    vm.loading = true;
    vm.init = function() {
      AnalyticsService.getCategoryWiseSpend().then(function(categoryMap) {
        vm.categoryData = {
          labels: Object.keys(categoryMap),
          data: Object.keys(categoryMap).map(function(k) { return categoryMap[k]; })
        };
        return AnalyticsService.getMonthlySpendTrend();
      }).then(function(monthlyTrend) {
        vm.monthlyData = monthlyTrend;
        vm.loading = false;
      });
    };
    vm.init();
  }]);
})();