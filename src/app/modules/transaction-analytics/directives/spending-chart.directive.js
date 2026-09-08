(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          analyticsData: '='
        },
        template: '<canvas id="spendingChart" width="400" height="400"></canvas>',
        link: function(scope, element, attrs) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chart = null;
          scope.$watch('analyticsData', function(newData) {
            if (newData && newData.categoryBreakdown) {
              var labels = newData.categoryBreakdown.map(function(cat) { return cat.categoryName; });
              var data = newData.categoryBreakdown.map(function(cat) { return cat.totalAmount; });
              var backgroundColors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
              ];
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: data,
                    backgroundColor: backgroundColors
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: {
                    position: 'bottom'
                  },
                  title: {
                    display: true,
                    text: 'Category-wise Spending Breakdown'
                  }
                }
              });
            }
          }, true);
        }
      };
    }]);
})();