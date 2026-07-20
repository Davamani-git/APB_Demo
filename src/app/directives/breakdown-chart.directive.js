(function () {
  'use strict';

  angular
    .module('apbDemo')
    .directive('breakdownChart', breakdownChartDirective);

  breakdownChartDirective.$inject = ['$window'];
  function breakdownChartDirective($window) {
    return {
      restrict: 'E',
      scope: {
        data: '<',
        isLoading: '<',
        error: '<'
      },
      templateUrl: 'src/templates/components/breakdown-chart.html',
      controller: BreakdownChartController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  BreakdownChartController.$inject = ['$element', '$scope'];
  function BreakdownChartController($element, $scope) {
    var vm = this;
    var chartInstance = null;

    vm.$onInit = function () {
      $scope.$watch(function () {
        return vm.data;
      }, function () {
        renderChart();
      }, true);
    };

    $scope.$on('$destroy', function () {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    function renderChart() {
      var canvas = $element[0].querySelector('canvas');
      if (!canvas || !window.Chart) {
        return;
      }

      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }

      if (!vm.data || !Array.isArray(vm.data.categories) || vm.data.categories.length === 0) {
        return;
      }

      var labels = vm.data.categories.map(function (c) { return c.label; });
      var values = vm.data.categories.map(function (c) { return c.amount; });
      var colors = window.APB_CHART_COLORS || ['#0052CC', '#2684FF', '#36B37E', '#FFAB00', '#DE350B', '#6554C0'];
      var bgColors = [];
      for (var i = 0; i < values.length; i++) {
        bgColors.push(colors[i % colors.length]);
      }

      var ctx = canvas.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: bgColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom'
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var currentValue = dataset.data[tooltipItem.index];
                var label = data.labels[tooltipItem.index];
                return label + ': ' + currentValue.toFixed(2);
              }
            }
          }
        }
      });
    }
  }
})();
