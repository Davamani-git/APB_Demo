(function () {
  "use strict";

  dashboardChart.$inject = [];

  function dashboardChart() {
    return {
      restrict: "E",
      scope: {
        breakdown: "<"
      },
      bindToController: true,
      controller: DashboardChartController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-chart.html",
      transclude: false,
      replace: false
    };
  }

  DashboardChartController.$inject = ["$element", "$timeout"];

  function DashboardChartController($element, $timeout) {
    var vm = this;

    vm.getChartConfig = function () {
      if (!vm.breakdown || !Array.isArray(vm.breakdown.items)) {
        return null;
      }

      var labels = vm.breakdown.items.map(function (item) { return item.categoryName; });
      var data = vm.breakdown.items.map(function (item) { return item.amount; });

      var colors = [
        "#337ab7", // blue
        "#5cb85c", // green
        "#f0ad4e", // orange
        "#d9534f", // red
        "#5bc0de"  // cyan
      ];

      return {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            hoverBackgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom"
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, chartData) {
                var dataset = chartData.datasets[tooltipItem.datasetIndex];
                var value = dataset.data[tooltipItem.index];
                var label = chartData.labels[tooltipItem.index];
                return label + ": " + value;
              }
            }
          }
        }
      };
    };

    vm.$onInit = function () {
      $timeout(function () {
        var config = vm.getChartConfig();
        if (!config) {
          return;
        }
        var canvas = $element[0].querySelector("#spendBreakdownChart");
        if (canvas && window.Chart) {
          new window.Chart(canvas.getContext("2d"), config);
        }
      }, 0);
    };
  }

  angular
    .module("app")
    .directive("dashboardChart", dashboardChart);
}());
