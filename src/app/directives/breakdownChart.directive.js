(function () {
    "use strict";

    BreakdownChartDirective.$inject = [];

    function BreakdownChartDirective() {
        return {
            restrict: "E",
            scope: {
                data: "<",
                onSegmentClick: "&"
            },
            bindToController: true,
            controller: BreakdownChartController,
            controllerAs: "vm",
            templateUrl: "templates/dashboard/breakdownChart.html"
        };
    }

    BreakdownChartController.$inject = ["$element", "$scope"];

    function BreakdownChartController($element, $scope) {
        var vm = this;
        var chartInstance = null;

        vm.chartTitle = "Spend Breakdown";

        function getCanvasContext() {
            var canvas = $element.find("canvas")[0];
            if (!canvas) {
                return null;
            }
            return canvas.getContext("2d");
        }

        function buildChartConfig() {
            var labels = [];
            var values = [];
            var backgroundColors = [];

            if (vm.data && vm.data.segments) {
                for (var i = 0; i < vm.data.segments.length; i++) {
                    var segment = vm.data.segments[i];
                    labels.push(segment.label);
                    values.push(segment.value);
                    var colorIndex = i % 5;
                    if (colorIndex === 0) {
                        backgroundColors.push("#0052CC");
                    } else if (colorIndex === 1) {
                        backgroundColors.push("#2684FF");
                    } else if (colorIndex === 2) {
                        backgroundColors.push("#36B37E");
                    } else if (colorIndex === 3) {
                        backgroundColors.push("#FFAB00");
                    } else {
                        backgroundColors.push("#DE350B");
                    }
                }
            }

            return {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: backgroundColors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        position: "bottom"
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var currentValue = dataset.data[tooltipItem.index];
                                var label = data.labels[tooltipItem.index];
                                return label + ": " + currentValue;
                            }
                        }
                    },
                    onClick: function (event, elements) {
                        if (!elements || !elements.length) {
                            return;
                        }
                        var element = elements[0];
                        var index = element._index;
                        var segment = vm.data && vm.data.segments ? vm.data.segments[index] : null;
                        if (segment && vm.onSegmentClick) {
                            vm.onSegmentClick({ segment: segment });
                        }
                    }
                }
            };
        }

        function renderChart() {
            var ctx = getCanvasContext();
            if (!ctx || !vm.data) {
                return;
            }

            var config = buildChartConfig();

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, config);
        }

        $scope.$watch(function () {
            return vm.data;
        }, function () {
            renderChart();
        }, true);
    }

    angular.module("app")
        .directive("breakdownChart", BreakdownChartDirective);
}());
