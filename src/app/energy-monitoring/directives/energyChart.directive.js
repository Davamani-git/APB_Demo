(function() {
  'use strict';
  angular.module('energyMonitoringApp').directive('energyChart', [energyChart]);
  function energyChart() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        period: '@'
      },
      template: '<div class="chart-container"><canvas id="energyChart" width="400" height="200"></canvas></div>',
      link: function(scope, element) {
        let chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            renderChart(newData);
          }
        });
        function renderChart(data) {
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          if (chart) {
            chart.destroy();
          }
          const labels = data.map(function(item) { return item.label || item.timestamp; });
          const values = data.map(function(item) { return item.usage || item.value; });
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Energy Usage (kWh)',
                data: values,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        }
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }
})();