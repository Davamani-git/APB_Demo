(function() {
  'use strict';
  angular.module('creditCardApp').directive('chartWrapper', [function() {
    return {
      restrict: 'E',
      scope: {
        chartType: '=',
        chartLabels: '=',
        chartData: '='
      },
      template: '<canvas id="chart-{{$id}}" width="400" height="200"></canvas>',
      link: function(scope, element) {
        scope.$watch('[chartLabels, chartData]', function(newVal) {
          if (newVal[0] && newVal[1]) {
            var ctx = element.find('canvas')[0].getContext('2d');
            new Chart(ctx, {
              type: scope.chartType,
              data: {
                labels: scope.chartLabels,
                datasets: [{
                  label: 'Amount (₹)',
                  data: scope.chartData,
                  backgroundColor: scope.chartType === 'pie' ? ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#C9CBCF','#8DD3C7','#BEBADA'] : 'rgba(54, 162, 235, 0.2)',
                  borderColor: scope.chartType === 'pie' ? '#fff' : 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }
        }, true);
      }
    };
  }]);
})();