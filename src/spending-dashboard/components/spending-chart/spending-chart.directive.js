(function () {
  "use strict";

  spendingChartDirective.$inject = ["$timeout"];

  function spendingChartDirective($timeout) {
    return {
      restrict: "E",
      scope: {
        breakdown: "="
      },
      bindToController: true,
      controllerAs: "vm",
      controller: ["$element", function ($element) {
        var vm = this;
        var chartInstance = null;

        vm.$onInit = function () {
          $timeout(renderChart, 0);
        };

        vm.$onChanges = function () {
          $timeout(renderChart, 0);
        };

        function destroyChart() {
          if (chartInstance && typeof chartInstance.destroy === "function") {
            chartInstance.destroy();
            chartInstance = null;
          }
        }

        function renderChart() {
          if (!vm.breakdown || !Array.isArray(vm.breakdown.categories) || !vm.breakdown.categories.length) {
            destroyChart();
            return;
          }

          var canvas = $element.find("canvas")[0];
          if (!canvas) {
            return;
          }

          var labels = vm.breakdown.categories.map(function (category) {
            return category.name;
          });
          var data = vm.breakdown.categories.map(function (category) {
            return category.amount;
          });

          var backgroundColors = [
            "#007bff",
            "#28a745",
            "#ffc107",
            "#17a2b8",
            "#6c757d"
          ];

          destroyChart();

          chartInstance = new Chart(canvas.getContext("2d"), {
            type: "doughnut",
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
                position: "right"
              },
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, chartData) {
                    var label = chartData.labels[tooltipItem.index] || "";
                    var value = chartData.datasets[0].data[tooltipItem.index] || 0;
                    return label + ": " + value.toFixed(2);
                  }
                }
              }
            }
          });
        }
      }],
      templateUrl: "src/spending-dashboard/components/spending-chart/spending-chart.template.html",
      transclude: false,
      replace: false
    };
  }

  angular.module("app")
    .directive("spendingChart", spendingChartDirective);
})();
