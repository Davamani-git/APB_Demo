(function () {
    'use strict';

    angular.module('apbDemo')
        .directive('breakdownChart', breakdownChart);

    breakdownChart.$inject = [];

    function breakdownChart() {
        return {
            restrict: 'E',
            scope: {
                data: '<'
            },
            templateUrl: 'templates/components/breakdown-chart.html',
            controller: BreakdownChartController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    BreakdownChartController.$inject = ['$scope'];

    function BreakdownChartController($scope) {
        var vm = this;
        var chartInstance = null;

        vm.hasData = function () {
            return vm.data && angular.isArray(vm.data.categories) && vm.data.categories.length > 0;
        };

        $scope.$watch(function () {
            return vm.data;
        }, function () {
            renderChart();
        }, true);

        function renderChart() {
            if (!vm.hasData()) {
                if (chartInstance) {
                    chartInstance.destroy();
                    chartInstance = null;
                }
                return;
            }
            var ctx = document.getElementById('breakdownChartCanvas');
            if (!ctx) {
                return;
            }
            var labels = [];
            var values = [];
            var colors = [];
            for (var i = 0; i < vm.data.categories.length; i++) {
                var item = vm.data.categories[i];
                labels.push(item.label);
                values.push(item.amount);
                colors.push(window.ChartColorPalette[i % window.ChartColorPalette.length]);
            }
            if (chartInstance) {
                chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom'
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var total = dataset.data.reduce(function (sum, value) {
                                    return sum + value;
                                }, 0);
                                var currentValue = dataset.data[tooltipItem.index];
                                var percentage = total === 0 ? 0 : Math.round((currentValue / total) * 100);
                                return data.labels[tooltipItem.index] + ': ' + currentValue + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            });
        }
    }
})();
