(function() {
  'use strict';

  function MonthlySummaryModel(data) {
    data = data || {};
    this.month = data.month || '';
    this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
    this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    this.averageSpend = typeof data.averageSpend === 'number' ? data.averageSpend : 0;
    this.currency = data.currency || 'INR';
    this.kpiMetrics = data.kpiMetrics || {};
    this.chartData = data.chartData || { labels: [], datasets: [] };
    this.chartOptions = data.chartOptions || { responsive: true };
    this.isEmpty = this.transactionCount === 0 && this.totalSpend === 0;
  }

  angular.module('app')
    .factory('MonthlySummaryModel', function() {
      return MonthlySummaryModel;
    });
})();
