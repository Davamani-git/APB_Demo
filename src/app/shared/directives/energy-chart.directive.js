(function() {
  'use strict';
  angular.module('energyDashboard')
    .directive('energyChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          timeframe: '='
        },
        template: '<canvas id="energyChart" width="400" height="100"></canvas>',
        link: function(scope, element, attrs) {
          let chart = null;
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          function renderChart() {
            if (!scope.chartData || !scope.chartData.dataPoints) {
              return;
            }
            const labels = scope.chartData.dataPoints.map(function(point) {
              const date = new Date(point.date);
              if (scope.timeframe === 'daily') {
                return date.getHours() + ':00';
              } else if (scope.timeframe === 'weekly') {
                return date.toLocaleDateString('en-US', { weekday: 'short' });
              } else {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }
            });
            const consumptionData = scope.chartData.dataPoints.map(function(point) {
              return point.consumption.toFixed(2);
            });
            const costData = scope.chartData.dataPoints.map(function(point) {
              return point.cost.toFixed(2);
            });
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Consumption (kWh)',
                    data: consumptionData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y'
                  },
                  {
                    label: 'Cost ($)',
                    data: costData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y1'
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                  mode: 'index',
                  intersect: false
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Consumption (kWh)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Cost ($)'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }
            });
          }
          scope.$watch('chartData', function(newVal, oldVal) {
            if (newVal) {
              $timeout(function() {
                renderChart();
              }, 100);
            }
          }, true);
          scope.$watch('timeframe', function(newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
              $timeout(function() {
                renderChart();
              }, 100);
            }
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