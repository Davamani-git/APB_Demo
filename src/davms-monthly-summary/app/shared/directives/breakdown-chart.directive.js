(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .directive('breakdownChart', breakdownChart);

  function breakdownChart() {
    return {
      restrict: 'E',
      scope: {
        entries: '<',
        title: '@'
      },
      bindToController: true,
      controller: BreakdownChartController,
      controllerAs: 'vmChart',
      templateUrl: 'app/shared/templates/components/breakdown-chart.html'
    };
  }

  BreakdownChartController.$inject = ['$timeout'];

  function BreakdownChartController($timeout) {
    var vm = this;
    var chartInstance;

    vm.$onInit = function() {
      $timeout(renderChart, 0);
    };

    vm.$onChanges = function() {
      $timeout(renderChart, 0);
    };

    function renderChart() {
      if (!vm.entries || !vm.entries.length) {
        return;
      }

      var labels = vm.entries.map(function(e) { return e.categoryLabel; });
      var data = vm.entries.map(function(e) { return e.amount; });

      var ctx = document.getElementById('davmsBreakdownChartCanvas');
      if (!ctx) {
        return;
      }

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount',
            data: data,
            backgroundColor: '#0066b3'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  }
})();
