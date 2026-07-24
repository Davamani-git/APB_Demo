(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp', ['chart.js'])
    .config(['ChartJsProvider', function (ChartJsProvider) {
      ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12
          }
        },
        elements: {
          line: {
            tension: 0.25,
            borderWidth: 2
          },
          point: {
            radius: 3,
            hoverRadius: 5
          }
        }
      });
    }]);
})();
