(function () {
  'use strict';

  angular.module('apbDemo')
    .directive('breakdownChart', breakdownChart);

  function breakdownChart() {
    return {
      restrict: 'E',
      scope: {
        data: '<'
      },
      templateUrl: 'src/templates/components/breakdown-chart.html',
      controller: BreakdownChartController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  BreakdownChartController.$inject = ['$scope'];
  function BreakdownChartController($scope) {
    var vm = this;
    vm.chartInstance = null;

    $scope.$watch(function () {
      return vm.data;
    }, function (newVal) {
      if (newVal) {
        renderChart(newVal);
      }
    }, true);

    function renderChart(breakdownModel) {
      var ctx = document.getElementById('breakdownChartCanvas');
      if (!ctx) {
        return;
      }
      var labels = [];
      var dataValues = [];
      if (breakdownModel && breakdownModel.categories && breakdownModel.categories.length > 0) {
        breakdownModel.categories.forEach(function (c) {
          labels.push(c.label);
          dataValues.push(c.amount);
        });
      }
      if (vm.chartInstance) {
        vm.chartInstance.destroy();
      }
      if (labels.length === 0) {
        vm.chartInstance = null;
        return;
      }
      vm.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: dataValues,
            backgroundColor: window.ApbdemoChartConfig.categoryColors,
            hoverBackgroundColor: window.ApbdemoChartConfig.categoryHoverColors
          }]
        },
        options: {
          responsive: true,
          legend: {
            position: 'right'
          },
          tooltips: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem, data) {
                var label = data.labels[tooltipItem.index] || '';
                var value = data.datasets[0].data[tooltipItem.index] || 0;
                return label + ': ' + value;
              }
            }
          }
        }
      });
    }
  }
})();
