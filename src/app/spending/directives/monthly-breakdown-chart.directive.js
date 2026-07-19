(function () {
  'use strict';

  monthlyBreakdownChart.$inject = [];
  MonthlyBreakdownChartController.$inject = ['$timeout'];

  angular
    .module('app')
    .directive('monthlyBreakdownChart', monthlyBreakdownChart);

  function monthlyBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        data: '<',
        currency: '@'
      },
      bindToController: true,
      controller: MonthlyBreakdownChartController,
      controllerAs: 'vm',
      templateUrl: 'app/spending/templates/components/monthly-breakdown-chart.template.html',
      replace: false,
      transclude: false
    };
  }

  function MonthlyBreakdownChartController($timeout) {
    var vm = this;
    var chartInstance = null;

    vm.$onInit = function () {
      $timeout(renderChart, 0);
    };

    vm.$onChanges = function (changes) {
      if (changes.data) {
        $timeout(renderChart, 0);
      }
    };

    function renderChart() {
      if (!vm.data) {
        return;
      }

      var canvas = document.getElementById('monthly-breakdown-chart-canvas');
      if (!canvas) {
        return;
      }

      var ctx = canvas.getContext('2d');
      var labels = [];
      var values = [];

      Object.keys(vm.data).forEach(function (category) {
        labels.push(category);
        values.push(vm.data[category] || 0);
      });

      var total = values.reduce(function (sum, v) { return sum + v; }, 0);

      var palette = [
        '#0055a4', '#00897b', '#f9a825', '#c62828', '#607d8b',
        '#7e57c2', '#26a69a', '#ff7043', '#9ccc65', '#5c6bc0'
      ];

      var backgroundColors = labels.map(function (_, index) {
        return palette[index % palette.length];
      });

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: backgroundColors
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
                var idx = tooltipItem.index;
                var label = data.labels[idx];
                var value = data.datasets[0].data[idx];
                var percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                var symbol = vm.currency === 'USD' ? '$' : vm.currency + ' ';
                return label + ': ' + symbol + Number(value).toFixed(2) + ' (' + percentage + '%)';
              }
            }
          }
        }
      });
    }
  }
})();
