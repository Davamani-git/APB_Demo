(function() {
  'use strict';

  ssSummaryChart.$inject = [];

  function ssSummaryChart() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        chartData: '<',
        chartOptions: '<'
      },
      controller: SummaryChartController,
      controllerAs: 'vm',
      templateUrl: 'src/app/modules/dashboard/templates/summary-chart.html'
    };
  }

  SummaryChartController.$inject = ['$element', '$scope'];

  function SummaryChartController($element, $scope) {
    var vm = this;
    vm.chartInstance = null;

    vm.$onInit = function() {
      $scope.$watch(function() {
        return vm.chartData;
      }, function(newVal) {
        if (newVal) {
          renderChart();
        }
      }, true);
    };

    function renderChart() {
      var canvas = $element[0].querySelector('canvas');
      if (!canvas || !vm.chartData) {
        return;
      }

      if (vm.chartInstance) {
        vm.chartInstance.destroy();
      }

      var context = canvas.getContext('2d');
      vm.chartInstance = new Chart(context, {
        type: 'bar',
        data: vm.chartData,
        options: vm.chartOptions || { responsive: true }
      });
    }
  }

  angular.module('app')
    .directive('ssSummaryChart', ssSummaryChart);
})();
