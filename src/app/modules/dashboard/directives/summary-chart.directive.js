(function () {
    'use strict';

    ssSummaryChart.$inject = [];

    function ssSummaryChart() {
        return {
            restrict: 'E',
            scope: {
                chartData: '<',
                chartOptions: '<',
                chartTitle: '@'
            },
            bindToController: true,
            controller: SummaryChartController,
            controllerAs: 'vm',
            templateUrl: 'src/app/modules/dashboard/templates/summary-chart.html'
        };
    }

    SummaryChartController.$inject = ['$element', '$scope'];

    function SummaryChartController($element, $scope) {
        var vm = this;
        var chartInstance = null;

        $scope.$watch(function () {
            return vm.chartData;
        }, function (newVal) {
            if (newVal) {
                renderChart();
            }
        }, true);

        function renderChart() {
            var canvas = $element[0].querySelector('canvas');
            if (!canvas || !vm.chartData) {
                return;
            }
            var ctx = canvas.getContext('2d');
            if (chartInstance) {
                chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
                type: (vm.chartData.type || 'bar'),
                data: vm.chartData,
                options: vm.chartOptions || {
                    responsive: true,
                    legend: {
                        position: 'bottom'
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var value = dataset.data[tooltipItem.index];
                                return dataset.label + ': ' + value;
                            }
                        }
                    }
                }
            });
        }
    }

    angular.module('app')
        .directive('ssSummaryChart', ssSummaryChart);

})();
