(function () {
  'use strict';

  SpendSummaryChartDirective.$inject = ['$timeout'];

  angular.module('app')
    .directive('spendSummaryChart', SpendSummaryChartDirective);

  function SpendSummaryChartDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        breakdown: '<',
        currencyCode: '@'
      },
      bindToController: true,
      controller: SpendSummaryChartController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary-chart.template.html',
      transclude: false,
      replace: false,
      link: function (scope, element) {
        var vm = scope.vm;
        scope.$watch(function () { return vm.breakdown; }, function (newVal) {
          if (!newVal || !newVal.length) {
            return;
          }
          $timeout(function () {
            renderChart(element[0].querySelector('canvas'), vm.breakdown, vm.currencyCode);
          }, 0);
        }, true);
      }
    };

    function renderChart(canvas, breakdown, currencyCode) {
      var labels = breakdown.map(function (item) { return item.segmentLabel; });
      var data = breakdown.map(function (item) { return item.amount; });
      var backgroundColors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

      if (!canvas) {
        return;
      }

      new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
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
              label: function (tooltipItem, chartData) {
                var label = chartData.labels[tooltipItem.index] || '';
                var value = chartData.datasets[0].data[tooltipItem.index] || 0;
                return label + ': ' + value.toFixed(2) + ' ' + currencyCode;
              }
            }
          }
        }
      });
    }
  }

  function SpendSummaryChartController() {
    var vm = this;
  }
})();
