(function () {
    'use strict';

    summaryChart.$inject = [];

    function summaryChart() {
        return {
            restrict: 'E',
            scope: {
                breakdown: '<',
                currencyCode: '@'
            },
            bindToController: true,
            controllerAs: 'vm',
            controller: SummaryChartController,
            templateUrl: 'src/features/monthly-summary/components/summary-chart.template.html',
            transclude: false,
            replace: false
        };
    }

    SummaryChartController.$inject = ['$element'];

    function SummaryChartController($element) {
        var vm = this;

        vm.$onInit = function () {
            vm.renderChart();
        };

        vm.$onChanges = function () {
            vm.renderChart();
        };

        vm.renderChart = function () {
            var canvas = $element[0].querySelector('canvas');
            if (!canvas || !vm.breakdown || vm.breakdown.length === 0) {
                return;
            }

            var labels = vm.breakdown.map(function (item) {
                return item.categoryLabel;
            });
            var data = vm.breakdown.map(function (item) {
                return item.totalAmount;
            });

            var context = canvas.getContext('2d');
            new Chart(context, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#337ab7', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom'
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, chartData) {
                                var label = chartData.labels[tooltipItem.index] || '';
                                var value = chartData.datasets[0].data[tooltipItem.index] || 0;
                                return label + ': ' + value;
                            }
                        }
                    }
                }
            });
        };
    }

    angular
        .module('app')
        .directive('summaryChart', summaryChart);
})();
