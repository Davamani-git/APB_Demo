(function() {
  'use strict';

  SixMonthTrendModel.$inject = ['MonthlyTrendPointModel'];

  function SixMonthTrendModel(MonthlyTrendPointModel) {
    return function(data) {
      data = data || {};
      this.points = [];
      if (Array.isArray(data.points)) {
        for (var i = 0; i < data.points.length; i++) {
          this.points.push(new MonthlyTrendPointModel(data.points[i]));
        }
      }

      var labels = [];
      var values = [];
      for (var j = 0; j < this.points.length; j++) {
        labels.push(this.points[j].month);
        values.push(this.points[j].totalSpend);
      }

      this.chartData = {
        labels: labels,
        datasets: [{
          label: 'Monthly Spend',
          data: values,
          borderColor: '#2684FF',
          backgroundColor: 'rgba(38,132,255,0.15)',
          fill: false
        }]
      };

      this.chartOptions = {
        responsive: true,
        legend: { position: 'bottom' },
        tooltips: { enabled: true },
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true }
          }]
        }
      };
    };
  }

  angular.module('app')
    .factory('SixMonthTrendModel', SixMonthTrendModel);
})();
