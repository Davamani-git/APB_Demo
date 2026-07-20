(function () {
  'use strict';

  angular.module('apbDemo')
    .directive('breakdownChart', breakdownChart);

  breakdownChart.$inject = [];

  function breakdownChart() {
    return {
      restrict: 'E',
      scope: {
        data: '<'
      },
      templateUrl: 'templates/components/breakdown-chart.html',
      controller: BreakdownChartController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  BreakdownChartController.$inject = ['$scope'];
  function BreakdownChartController($scope) {
    var vm = this;
    var chartInstance = null;

    vm.$onInit = function () {
      $scope.$watch(function () {
        return vm.data;
      }, function (newVal) {
        if (newVal) {
          renderChart(newVal);
        } else {
          destroyChart();
        }
      }, true);
    };

    function renderChart(breakdownModel) {
      var ctx = document.getElementById('breakdownChartCanvas');
      if (!ctx) {
        return;
      }

      var labels = [];
      var values = [];
      var colors = [];

      if (breakdownModel.categories && breakdownModel.categories.length > 0) {
        breakdownModel.categories.forEach(function (category, index) {
          labels.push(category.label);
          values.push(category.amount);
          colors.push(window.ChartConfig.colors[index % window.ChartConfig.colors.length]);
        });
      }

      destroyChart();

      if (values.length === 0) {
        return;
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          legend: {
            position: 'right'
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var value = dataset.data[tooltipItem.index];
                var label = data.labels[tooltipItem.index];
                return label + ': ' + value;
              }
            }
          }
        }
      });
    }

    function destroyChart() {
      if (chartInstance && typeof chartInstance.destroy === 'function') {
        chartInstance.destroy();
        chartInstance = null;
      }
    }
  }
})();
