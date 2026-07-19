(function() {
  'use strict';

  ssTrendsChart.$inject = [];

  function ssTrendsChart() {
    return {
      restrict: 'E',
      scope: {
        chartData: '<',
        chartOptions: '<',
        title: '@'
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: ['$element', '$scope', function($element, $scope) {
        var vm = this;
        var chartInstance = null;

        function renderChart() {
          var canvas = $element.find('canvas')[0];
          if (!canvas || !vm.chartData || !vm.chartData.labels) {
            return;
          }
          var ctx = canvas.getContext('2d');
          if (chartInstance) {
            chartInstance.destroy();
          }
          chartInstance = new Chart(ctx, {
            type: 'line',
            data: vm.chartData,
            options: vm.chartOptions || { responsive: true }
          });
        }

        $scope.$watch(function() { return vm.chartData; }, function(newVal) {
          if (newVal) {
            renderChart();
          }
        }, true);

        $scope.$on('$destroy', function() {
          if (chartInstance) {
            chartInstance.destroy();
          }
        });
      }],
      templateUrl: 'src/app/modules/dashboard/templates/trends-chart.html'
    };
  }

  angular.module('app')
    .directive('ssTrendsChart', ssTrendsChart);
})();
