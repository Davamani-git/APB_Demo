(function() {
  'use strict';
  angular.module('spendingAnalytics').controller('AnalyticsController', ['$scope', 'AnalyticsService', 'HistoricalDataService', function($scope, AnalyticsService, HistoricalDataService) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.trendData = null;
    vm.cardPerformance = [];
    vm.selectedMonth = null;
    vm.selectedCard = null;

    function loadAnalyticsData() {
      vm.loading = true;
      vm.error = null;
      HistoricalDataService.getHistoricalData(12).then(function(historicalData) {
        vm.trendData = AnalyticsService.calculateTrends(historicalData);
        vm.cardPerformance = AnalyticsService.calculateCardPerformance(historicalData);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    }

    vm.selectMonth = function(month) {
      vm.selectedMonth = month;
    };

    vm.selectCard = function(cardId) {
      vm.selectedCard = cardId;
    };

    function init() {
      loadAnalyticsData();
    }

    init();
  }]);
})();