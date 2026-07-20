(function () {
    'use strict';

    angular
        .module('app')
        .directive('spendingChart', spendingChart);

    function spendingChart() {
        return {
            restrict: 'E',
            scope: {
                chartTitle: '@',
                chartData: '<'
            },
            template: '<div class="chart-container"><canvas></canvas></div>',
            link: function (scope, element, attrs) {
                var canvas = element.find('canvas')[0];
                var ctx = canvas.getContext('2d');
                var chartInstance = null;

                scope.$watch('chartData', function (newData) {
                    if (newData && newData.labels && newData.datasets) {
                        if (chartInstance) {
                            chartInstance.destroy();
                        }
                        chartInstance = new Chart(ctx, {
                            type: newData.chartType || 'bar',
                            data: {
                                labels: newData.labels,
                                datasets: newData.datasets
                            },
                            options: angular.extend({
                                responsive: true,
                                maintainAspectRatio: false,
                                legend: { display: true, position: 'bottom' },
                                tooltips: { mode: 'index', intersect: false }
                            }, newData.options)
                        });
                    }
                });
            }
        };
    }
})();