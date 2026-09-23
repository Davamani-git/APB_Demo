(function() {
  'use strict';
  angular.module('creditDashboardApp').directive('monthlyTrendChart', [function() {
    return {
      restrict: 'E',
      scope: {
        trendData: '='
      },
      template: '<canvas id="monthlyTrendCanvas" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        scope.$watch('trendData', function(newVal) {
          if (newVal && newVal.length > 0) {
            var ctx = document.getElementById('monthlyTrendCanvas').getContext('2d');
            var labels = newVal.map(function(d) { return d.month; });
            var data = newVal.map(function(d) { return d.spend; });
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: data,
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
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
        });
      }
    };
  }]);
})();