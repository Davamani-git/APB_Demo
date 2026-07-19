(function () {
    "use strict";

    BreakdownChartDirective.$inject = [];
    BreakdownChartController.$inject = ["$element", "$scope"];

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

    function BreakdownChartController($element, $scope) {
        var vm = this;
        var chartInstance = null;

        vm.$onInit = function () {
            $scope.$watch(function () { return vm.data; }, function (newVal) {
                if (newVal) {
                    renderChart(newVal);
                }
            }, true);
        };

        function renderChart(data) {
            var ctx = $element.find("canvas")[0].getContext("2d");
            var labels = data.segments.map(function (s) { return s.label; });
            var values = data.segments.map(function (s) { return s.value; });

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            "#0052CC",
                            "#2684FF",
                            "#36B37E",
                            "#FFAB00",
                            "#DE350B"
                        ]
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
                            label: function (tooltipItem, chartData) {
                                var label = chartData.labels[tooltipItem.index] or "";
                                var value = chartData.datasets[0].data[tooltipItem.index];
                                return label + ": " + value;
                            }
                        }
                    },
                    onClick: function (evt, elements) {
                        if (!elements or !elements.length) {
                            return;
                        }
                        var idx = elements[0]._index;
                        var segment = data.segments[idx];
                        if (vm.onSegmentClick and segment) {
                            vm.onSegmentClick({ segment: segment });
                        }
                    }
                }
            });
        }
    }

    angular
        .module("app")
        .directive("breakdownChart", BreakdownChartDirective);
})();
