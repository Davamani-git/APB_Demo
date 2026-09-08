(function() {
  'use strict';
  angular.module('transactionAnalyticsModule')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          analyticsData: '='
        },
        template: '<canvas id="spendingChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          let chart = null;
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          function renderChart(data) {
            if (!data || !data.categoryBreakdown || data.categoryBreakdown.length === 0) {
              if (chart) {
                chart.destroy();
                chart = null;
              }
              return;
            }
            const labels = data.categoryBreakdown.map(function(cat) { return cat.categoryName; });
            const amounts = data.categoryBreakdown.map(function(cat) { return cat.totalAmount; });
            const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
            if (chart) {
              chart.data.labels = labels;
              chart.data.datasets[0].data = amounts;
              chart.data.datasets[0].backgroundColor = backgroundColors.slice(0, labels.length);
              chart.update();
            } else {
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: amounts,
                    backgroundColor: backgroundColors.slice(0, labels.length)
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: { position: 'right' },
                  title: { display: true, text: 'Category-wise Spending Breakdown' }
                }
              });
            }
          }
          scope.$watch('analyticsData', function(newVal) {
            if (newVal) {
              renderChart(newVal);
            }
          }, true);
          scope.$on('analyticsUpdated', function(event, data) {
            renderChart(data);
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();