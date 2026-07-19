(function () {
    'use strict';

    SixMonthTrendModel.$inject = ['MonthlyTrendPointModel'];

    function SixMonthTrendModel(MonthlyTrendPointModel) {
        function create(points, chartData, chartOptions) {
            return {
                points: points,
                chartData: chartData,
                chartOptions: chartOptions
            };
        }

        function createFromResponse(data) {
            var points = [];
            if (data.points && angular.isArray(data.points)) {
                for (var i = 0; i < data.points.length; i++) {
                    points.push(MonthlyTrendPointModel.createFromResponse(data.points[i]));
                }
            }

            var labels = [];
            var values = [];
            points.forEach(function (p) {
                labels.push(p.month);
                values.push(p.totalSpend);
            });

            var chartData = data.chartData || {
                labels: labels,
                datasets: [
                    {
                        label: 'Monthly Spend',
                        data: values,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        fill: false
                    }
                ]
            };

            var chartOptions = data.chartOptions || {
                responsive: true,
                legend: {
                    position: 'bottom'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            };

            return create(points, chartData, chartOptions);
        }

        return {
            create: create,
            createFromResponse: createFromResponse
        };
    }

    angular.module('app')
        .service('SixMonthTrendModel', SixMonthTrendModel);

})();
