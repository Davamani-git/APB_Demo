(function () {
  'use strict';

  function spendingTrendChart() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        loading: '=',
        error: '='
      },
      templateUrl: 'templates/directives/spending-trend-chart.html',
      controller: SpendingTrendChartController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  SpendingTrendChartController.$inject = ['$element'];

  function SpendingTrendChartController($element) {
    var vm = this;
    var chartInstance = null;

    vm.$onInit = function () {
      renderChart();
    };

    vm.$onChanges = function (changes) {
      if (changes.chartData) {
        renderChart();
      }
    };

    function renderChart() {
      if (!vm.chartData || vm.loading || vm.error) {
        return;
      }
      var canvas = $element.find('canvas')[0];
      if (!canvas) {
        return;
      }
      var ctx = canvas.getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, vm.chartData);
    }
  }

  angular.module('app')
    .directive('spendingTrendChart', spendingTrendChart);
})();
