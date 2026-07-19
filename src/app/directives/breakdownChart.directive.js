(function () {
    'use strict';

    BreakdownChartDirective.$inject = [];

    function BreakdownChartDirective() {
        return {
            restrict: 'E',
            scope: {
                data: '<',
                onSegmentClick: '&'
            },
            bindToController: true,
            controller: BreakdownChartController,
            controllerAs: 'vm',
            templateUrl: 'templates/dashboard/breakdownChart.html'
        };
    }

    BreakdownChartController.$inject = ['$element', '$scope'];

    function BreakdownChartController($element, $scope) {
        var vm = this;
        vm.chartInstance = null;
        vm.legendColors = [];

        $scope.$watch(function () { return vm.data; }, function (newVal) {
            if (newVal) {
                renderChart();
            } else if (vm.chartInstance) {
                vm.chartInstance.destroy();
                vm.chartInstance = null;
            }
        }, true);

        function renderChart() {
            if (!vm.data || !vm.data.segments || !vm.data.segments.length) {
                if (vm.chartInstance) {
                    vm.chartInstance.destroy();
                    vm.chartInstance = null;
                }
                return;
            }

            var canvas = $element[0].querySelector('#breakdownChartCanvas');
            if (!canvas) {
                return;
            }

            var labels = vm.data.segments.map(function (s) { return s.label; });
            var values = vm.data.segments.map(function (s) { return s.value; });

            var colors = [
                '#0052CC', '#2684FF', '#36B37E', '#FFAB00', '#DE350B', '#6554C0'
            ];

            vm.legendColors = vm.data.segments.map(function (_, index) {
                return colors[index % colors.length];
            });

            var config = {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: vm.legendColors,
                        borderColor: '#FFFFFF',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index] || '';
                                var value = data.datasets[0].data[tooltipItem.index] || 0;
                                return label + ': ' + value;
                            }
                        }
                    },
                    onClick: function (evt, elements) {
                        if (elements && elements.length && vm.onSegmentClick) {
                            var index = elements[0]._index;
                            var segment = vm.data.segments[index];
                            vm.onSegmentClick({ segment: segment });
                        }
                    }
                }
            };

            if (vm.chartInstance) {
                vm.chartInstance.destroy();
                vm.chartInstance = null;
            }

            vm.chartInstance = new Chart(canvas.getContext('2d'), config);
        }
    }

    angular.module('app')
        .directive('breakdownChart', BreakdownChartDirective);
})();
