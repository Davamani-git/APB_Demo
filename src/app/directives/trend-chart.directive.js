(function() {
  'use strict';
  angular.module('spendingAnalytics').directive('trendChart', function() {
    return {
      restrict: 'A',
      scope: {
        trendData: '=',
        selectedMonth: '=',
        onSelect: '&'
      },
      link: function(scope, element, attrs) {
        var canvas = document.createElement('canvas');
        canvas.id = 'trendChart';
        element.append(canvas);
        var ctx = canvas.getContext('2d');
        var chart = null;

        function renderChart() {
          if (!scope.trendData) return;
          if (chart) {
            chart.destroy();
          }
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: scope.trendData.months,
              datasets: [
                {
                  label: 'Monthly Spend',
                  data: scope.trendData.spendValues,
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  tension: 0.1
                },
                {
                  label: 'Trend Line',
                  data: scope.trendData.trendLine,
                  borderColor: 'rgb(255, 99, 132)',
                  borderDash: [5, 5],
                  fill: false
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              onClick: function(evt, activeElements) {
                if (activeElements.length > 0) {
                  var index = activeElements[0]._index;
                  var month = scope.trendData.months[index];
                  scope.$apply(function() {
                    scope.onSelect({month: month});
                  });
                }
              },
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

        scope.$watch('trendData', function(newVal) {
          if (newVal) {
            renderChart();
          }
        });

        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  });
})();