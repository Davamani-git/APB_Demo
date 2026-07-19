(function () {
    'use strict';

    ssTrendsChart.$inject = [];

    function ssTrendsChart() {
        return {
            restrict: 'E',
            scope: {
                chartData: '<',
                chartOptions: '<',
                chartTitle: '@'
            },
            bindToController: true,
            controller: TrendsChartController,
            controllerAs: 'vm',
            templateUrl: 'src/app/modules/dashboard/templates/trends-chart.html'
        };
    }

    TrendsChartController.$inject = ['$element', '$scope'];

    function TrendsChartController($element, $scope) {
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
                type: (vm.chartData.type || 'line'),
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
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }

    angular.module('app')
        .directive('ssTrendsChart', ssTrendsChart);

})();
