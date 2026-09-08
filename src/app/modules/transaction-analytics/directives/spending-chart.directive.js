angular.module('transactionAnalyticsModule').directive('spendingChart', [function() {
  return {
    restrict: 'E',
    scope: {
      analyticsData: '='
    },
    template: '<canvas id="spendingChart" width="400" height="300"></canvas>',
    link: function(scope, element, attrs) {
      const canvas = element.find('canvas')[0];
      const ctx = canvas.getContext('2d');
      let chart = null;
      scope.$watch('analyticsData', function(newData) {
        if (newData && newData.categoryBreakdown && newData.categoryBreakdown.length > 0) {
          const labels = newData.categoryBreakdown.map(function(cat) { return cat.categoryName; });
          const data = newData.categoryBreakdown.map(function(cat) { return cat.totalAmount; });
          const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
          if (chart) {
            chart.destroy();
          }
          chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 1
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
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    const label = data.labels[tooltipItem.index] || '';
                    const value = data.datasets[0].data[tooltipItem.index];
                    const total = data.datasets[0].data.reduce(function(a, b) { return a + b; }, 0);
                    const percentage = ((value / total) * 100).toFixed(2);
                    return label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                  }
                }
              }
            }
          });
        }
      }, true);
      scope.$on('$destroy', function() {
        if (chart) {
          chart.destroy();
        }
      });
    }
  };
}]);