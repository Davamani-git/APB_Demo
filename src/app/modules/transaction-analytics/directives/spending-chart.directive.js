angular.module('transactionAnalyticsModule').directive('spendingChart', function() {
  return {
    restrict: 'E',
    scope: {
      analyticsData: '='
    },
    template: '<canvas id="spendingChart" width="400" height="400"></canvas>',
    link: function(scope, element, attrs) {
      const canvas = element.find('canvas')[0];
      const ctx = canvas.getContext('2d');
      let chart = null;
      function renderChart(data) {
        if (!data || !data.categoryBreakdown || data.categoryBreakdown.length === 0) return;
        const labels = data.categoryBreakdown.map(function(c) { return c.categoryName; });
        const amounts = data.categoryBreakdown.map(function(c) { return c.totalAmount; });
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: amounts,
              backgroundColor: colors
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: { position: 'bottom' },
            title: { display: true, text: 'Category-wise Spending' }
          }
        });
      }
      scope.$watch('analyticsData', function(newVal) {
        if (newVal) renderChart(newVal);
      }, true);
      scope.$on('analyticsUpdated', function(event, data) {
        renderChart(data);
      });
    }
  };
});