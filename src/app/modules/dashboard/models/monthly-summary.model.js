(function() {
  'use strict';

  MonthlySummaryModel.$inject = [];

  function MonthlySummaryModel() {}

  MonthlySummaryModel.prototype.fromResponse = function(data) {
    if (!data) {
      return this;
    }

    this.month = typeof data.month === 'string' ? data.month : '';
    this.totalSpend = typeof data.totalSpend === 'number' && data.totalSpend >= 0 ? data.totalSpend : 0;
    this.transactionCount = typeof data.transactionCount === 'number' && data.transactionCount >= 0 ? data.transactionCount : 0;
    this.currency = typeof data.currency === 'string' ? data.currency : '';
    this.averageSpend = typeof data.averageSpend === 'number' && data.averageSpend >= 0 ? data.averageSpend : 0;
    this.kpiMetrics = data.kpiMetrics && typeof data.kpiMetrics === 'object' ? data.kpiMetrics : {};
    this.chartData = data.chartData && typeof data.chartData === 'object' ? data.chartData : { labels: [], datasets: [] };
    this.chartOptions = data.chartOptions && typeof data.chartOptions === 'object' ? data.chartOptions : {};

    this.isEmpty = this.transactionCount === 0 || (this.totalSpend === 0 && this.chartData.labels.length === 0);

    return this;
  };

  MonthlySummaryModel.prototype.getFormattedTotalSpend = function() {
    if (!this.currency) {
      return this.totalSpend.toFixed(2);
    }
    return this.currency + ' ' + this.totalSpend.toFixed(2);
  };

  MonthlySummaryModel.prototype.getFormattedAverageSpend = function() {
    if (this.transactionCount === 0) {
      return 'Not available';
    }
    var value = this.averageSpend || 0;
    if (!this.currency) {
      return value.toFixed(2);
    }
    return this.currency + ' ' + value.toFixed(2);
  };

  angular.module('app')
    .factory('MonthlySummaryModel', function() {
      return MonthlySummaryModel;
    });
})();
