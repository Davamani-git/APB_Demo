(function() {
  'use strict';
  angular.module('creditDashboardApp').controller('AnalyticsController', ['AnalyticsService', '$scope', function(AnalyticsService, $scope) {
    var vm = this;
    vm.monthlyTrends = [];
    vm.categoryData = [];
    vm.cardWiseData = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedMonth = '2025-02';
    vm.loadAnalytics = function() {
      vm.loading = true;
      AnalyticsService.getMonthlyTrends('user123').then(function(trends) {
        vm.monthlyTrends = trends;
        return AnalyticsService.getCategoryWiseSpend('user123', vm.selectedMonth);
      }).then(function(categoryData) {
        vm.categoryData = categoryData;
        return AnalyticsService.getCardWiseSpend('user123', vm.selectedMonth);
      }).then(function(cardWiseData) {
        vm.cardWiseData = cardWiseData;
        vm.loading = false;
        $scope.$apply();
      }).catch(function(err) {
        vm.error = 'Failed to load analytics';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.loadAnalytics();
  }]);
  angular.module('creditDashboardApp').controller('AnalyticsController').$inject = ['AnalyticsService', '$scope'];
})();