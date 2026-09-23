(function() {
  'use strict';
  angular.module('creditDashboardApp').directive('categoryChart', [function() {
    return {
      restrict: 'E',
      scope: {
        categoryData: '='
      },
      template: '<canvas id="categoryChartCanvas" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        scope.$watch('categoryData', function(newVal) {
          if (newVal && newVal.length > 0) {
            var ctx = document.getElementById('categoryChartCanvas').getContext('2d');
            var labels = newVal.map(function(d) { return d.category; });
            var data = newVal.map(function(d) { return d.spend; });
            var colors = [
              'rgba(255,99,132,0.6)',
              'rgba(54,162,235,0.6)',
              'rgba(255,206,86,0.6)',
              'rgba(75,192,192,0.6)',
              'rgba(153,102,255,0.6)',
              'rgba(255,159,64,0.6)',
              'rgba(201,203,207,0.6)',
              'rgba(100,149,237,0.6)',
              'rgba(144,238,144,0.6)'
            ];
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: data,
                  backgroundColor: colors
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }
        });
      }
    };
  }]);
})();