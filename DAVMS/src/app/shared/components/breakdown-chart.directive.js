(function () {
  "use strict";

  breakdownChartDirective.$inject = [];

  function breakdownChartDirective() {
    return {
      restrict: "E",
      scope: {
        chartData: "=",
        totalSpend: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: ["$element", "$scope", function ($element, $scope) {
        const vm = this;
        let chartInstance = null;

        function renderChart() {
          if (!vm.chartData || !vm.chartData.data || !vm.chartData.data.length) {
            return;
          }
          const canvasElement = $element.find("canvas")[0];
          if (!canvasElement) {
            return;
          }
          const ctx = canvasElement.getContext("2d");
          const config = {
            type: "pie",
            data: {
              labels: vm.chartData.labels,
              datasets: [{
                data: vm.chartData.data,
                backgroundColor: vm.chartData.colors
              }]
            },
            options: {
              responsive: true,
              legend: {
                position: "bottom"
              },
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const value = dataset.data[tooltipItem.index];
                    const label = data.labels[tooltipItem.index];
                    const numericValue = Number(value) || 0;
                    return label + ": " + numericValue.toFixed(2);
                  }
                }
              }
            }
          };

          if (chartInstance) {
            chartInstance.destroy();
          }
          chartInstance = new Chart(ctx, config);
        }

        $scope.$watch(function () {
          return vm.chartData;
        }, function (newVal) {
          if (newVal) {
            renderChart();
          }
        }, true);
      }],
      templateUrl: "app/shared/components/breakdown-chart.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app")
    .directive("breakdownChart", breakdownChartDirective);
})();
