(function() {
  'use strict';

  SixMonthTrendModel.$inject = ['MonthlyTrendPointModel'];

  function SixMonthTrendModel(MonthlyTrendPointModel) {
    this.MonthlyTrendPointModel = MonthlyTrendPointModel;
    this.points = [];
    this.chartData = { labels: [], datasets: [] };
    this.chartOptions = {};
  }

  SixMonthTrendModel.prototype.fromResponse = function(data) {
    var self = this;
    self.points = [];
    self.chartData = { labels: [], datasets: [] };
    self.chartOptions = {};

    if (!data) {
      return self;
    }

    if (Array.isArray(data.points)) {
      data.points.forEach(function(pointData) {
        var point = new self.MonthlyTrendPointModel().fromResponse(pointData);
        self.points.push(point);
      });
    }

    if (data.chartData && typeof data.chartData === 'object') {
      self.chartData = data.chartData;
    } else {
      self.chartData.labels = self.points.map(function(p) { return p.month; });
      self.chartData.datasets = [{
        label: 'Monthly Spend',
        data: self.points.map(function(p) { return p.totalSpend; }),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33,150,243,0.2)',
        fill: false
      }];
    }

    if (data.chartOptions && typeof data.chartOptions === 'object') {
      self.chartOptions = data.chartOptions;
    } else {
      self.chartOptions = {
        responsive: true,
        legend: { position: 'bottom' },
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true }
          }]
        }
      };
    }

    return self;
  };

  SixMonthTrendModel.prototype.isEmpty = function() {
    return !this.points || this.points.length === 0;
  };

  angular.module('app')
    .factory('SixMonthTrendModel', SixMonthTrendModel);
})();
