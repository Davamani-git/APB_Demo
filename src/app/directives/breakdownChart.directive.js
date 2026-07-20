(function () {
    "use strict";

    angular.module("app")
        .directive("breakdownChart", breakdownChart);

    breakdownChart.$inject = [];

    function breakdownChart() {
        return {
            restrict: "E",
            scope: {
                items: "<",
                isLoading: "<",
                isEmpty: "<"
            },
            templateUrl: "src/templates/monthlySummary/_breakdownChart.partial.html",
            bindToController: true,
            controllerAs: "vm",
            controller: BreakdownChartController
        };
    }

    BreakdownChartController.$inject = ["$element", "$scope"];

    function BreakdownChartController($element, $scope) {
        var vm = this;
        var chartInstance = null;

        $scope.$watch(function () {
            return vm.items;
        }, function (newItems) {
            if (!newItems || !angular.isArray(newItems) || newItems.length === 0) {
                destroyChart();
                return;
            }
            renderChart(newItems);
        }, true);

        function renderChart(items) {
            var canvas = $element.find("canvas")[0];
            if (!canvas) {
                return;
            }
            var labels = [];
            var data = [];
            var backgroundColors = [];

            var palette = [
                "#0052CC", "#2684FF", "#36B37E", "#FFAB00", "#DE350B",
                "#6554C0", "#00B8D9", "#4C9AFF", "#FF5630", "#57D9A3"
            ];

            items.forEach(function (item, index) {
                labels.push(item.categoryName);
                data.push(item.amount);
                backgroundColors.push(palette[index % palette.length]);
            });

            var config = {
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
                    maintainAspectRatio: false,
                    legend: {
                        position: "right"
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index] || "";
                                var value = data.datasets[0].data[tooltipItem.index] || 0;
                                return label + ": " + value.toFixed(2);
                            }
                        }
                    }
                }
            };

            destroyChart();
            chartInstance = new Chart(canvas.getContext("2d"), config);
        }

        function destroyChart() {
            if (chartInstance && typeof chartInstance.destroy === "function") {
                chartInstance.destroy();
                chartInstance = null;
            }
        }
    }
})();
