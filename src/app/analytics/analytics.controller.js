(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .controller('AnalyticsController', ['SpendingAnalyticsService', '$scope', function(SpendingAnalyticsService, $scope) {
      var vm = this;
      vm.analytics = {};
      vm.loading = true;
      vm.error = null;
      vm.dateRange = {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        endDate: new Date()
      };
      vm.categoryChartData = null;
      vm.monthlyChartData = null;
      vm.init = function() {
        vm.loadAnalytics();
      };
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        SpendingAnalyticsService.getSpendingData(vm.dateRange)
          .then(function(analytics) {
            vm.analytics = analytics;
            vm.prepareCategoryChart();
            vm.prepareMonthlyChart();
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
          });
      };
      vm.prepareCategoryChart = function() {
        var labels = [];
        var data = [];
        vm.analytics.categories.forEach(function(cat) {
          labels.push(cat.categoryName);
          data.push(cat.totalAmount);
        });
        vm.categoryChartData = {
          labels: labels,
          datasets: [{
            label: 'Spending by Category',
            data: data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
            ]
          }]
        };
      };
      vm.prepareMonthlyChart = function() {
        var labels = [];
        var datasets = {};
        vm.analytics.monthlyTrends.forEach(function(trend) {
          labels.push(trend.month);
          Object.keys(trend.categoryBreakdown).forEach(function(cat) {
            if (!datasets[cat]) {
              datasets[cat] = [];
            }
            datasets[cat].push(trend.categoryBreakdown[cat]);
          });
        });
        var chartDatasets = [];
        Object.keys(datasets).forEach(function(cat) {
          chartDatasets.push({
            label: cat,
            data: datasets[cat],
            fill: false,
            borderColor: '#' + Math.floor(Math.random()*16777215).toString(16)
          });
        });
        vm.monthlyChartData = {
          labels: labels,
          datasets: chartDatasets
        };
      };
      vm.onCategoryClick = function(category) {
        console.log('Category clicked:', category);
      };
      vm.init();
    }]);
})();