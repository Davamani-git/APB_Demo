(function () {
    "use strict";

    BreakdownChartDirective.$inject = ["$timeout"];

    function BreakdownChartDirective($timeout) {
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

    BreakdownChartController.$inject = ["$timeout"];

    function BreakdownChartController($timeout) {
        var vm = this;
        vm.chartInstance = null;
        vm.hasData = false;

        vm.$onInit = function () {
            $timeout(function () {
                buildChart();
            }, 0);
        };

        vm.$onChanges = function () {
            $timeout(function () {
                buildChart();
            }, 0);
        };

        function buildChart() {
            if (!vm.data || !vm.data.segments || !vm.data.segments.length) {
                vm.hasData = false;
                return;
            }
            vm.hasData = true;

            var labels = vm.data.segments.map(function (segment) { return segment.label; });
            var values = vm.data.segments.map(function (segment) { return segment.value; });

            var colors = ["#0052CC", "#2684FF", "#36B37E", "#FFAB00", "#DE350B", "#5E6C84"];
            var backgroundColors = [];
            for (var i = 0; i < values.length; i++) {
                backgroundColors.push(colors[i % colors.length]);
            }

            var canvas = document.getElementById("breakdownChartCanvas");
            if (!canvas) {
                return;
            }

            if (vm.chartInstance) {
                vm.chartInstance.destroy();
            }

            vm.chartInstance = new Chart(canvas, {
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
                    legend: {
                        position: "right"
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index] || "";
                                var value = data.datasets[0].data[tooltipItem.index] || 0;
                                return label + ": " + value.toLocaleString();
                            }
                        }
                    },
                    onClick: function (event, elements) {
                        if (elements && elements.length && vm.onSegmentClick) {
                            var index = elements[0]._index;
                            var segment = vm.data.segments[index];
                            vm.onSegmentClick({ segment: segment });
                        }
                    }
                }
            });
        }
    }

    angular.module("app")
        .directive("breakdownChart", BreakdownChartDirective);
})();
