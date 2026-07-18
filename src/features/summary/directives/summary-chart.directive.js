angular.module('davms.summary').directive('davmsSummaryChart', davmsSummaryChart);

function davmsSummaryChart() {
  return {
    restrict: 'E',
    scope: {
      items: '='
    },
    template: [
      '<div class="panel panel-default">',
      '  <div class="panel-heading">',
      '    <h3 class="panel-title">Spending Breakdown</h3>',
      '  </div>',
      '  <div class="panel-body">',
      '    <canvas id="breakdownChart" width="400" height="200"></canvas>',
      '  </div>',
      '</div>'
    ].join(''),
    link: function(scope, element) {
      let chart = null;
      const canvas = element.find('canvas')[0];
      const ctx = canvas.getContext('2d');

      scope.$watch('items', function(newItems) {
        if (chart) {
          chart.destroy();
        }

        if (!newItems || !newItems.length) {
          return;
        }

        const labels = newItems.map(function(item) { return item.categoryLabel; });
        const data = newItems.map(function(item) { return item.amount; });
        const colors = generateColors(newItems.length);

        chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: colors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'bottom'
            }
          }
        });
      });

      scope.$on('$destroy', function() {
        if (chart) {
          chart.destroy();
        }
      });

      function generateColors(count) {
        const colors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];
        return colors.slice(0, count);
      }
    }
  };
}