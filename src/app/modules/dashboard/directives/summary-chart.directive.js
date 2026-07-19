(function() {
  'use strict';

  ssSummaryChart.$inject = [];

  function ssSummaryChart() {
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
            type: 'bar',
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
            chartInstance.destroy();n          }
        });
      }],
      templateUrl: 'src/app/modules/dashboard/templates/summary-chart.html'
    };
  }

  angular.module('app')
    .directive('ssSummaryChart', ssSummaryChart);
})();
