(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .factory('MonthlySummaryModel', MonthlySummaryModelFactory);

  MonthlySummaryModelFactory.$inject = ['BreakdownModel'];

  function MonthlySummaryModelFactory(BreakdownModel) {
    function MonthlySummaryModel(data) {
      data = data || {};
      this.customerId = data.customerId || null;
      this.cardReference = data.cardReference || null;
      this.month = data.month || null;
      this.currency = data.currency || 'USD';
      this.totalSpend = Number(data.totalSpend || 0);
      this.transactionCount = Number(data.transactionCount || 0);
      this.averageTransactionValue = Number(data.averageTransactionValue || 0);
      this.breakdown = (data.breakdown || []).map(function (b) { return new BreakdownModel(b); });
      this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : null;
      this.isPreComputed = !!data.isPreComputed;
      this.dataFreshness = data.dataFreshness || 'UNKNOWN';
    }

    MonthlySummaryModel.prototype.isStale = function (freshnessThresholdMinutes) {
      if (!this.lastUpdated) {
        return false;
      }
      var now = new Date();
      var diffMinutes = (now.getTime() - this.lastUpdated.getTime()) / 60000;
      return diffMinutes > freshnessThresholdMinutes;
    };

    return MonthlySummaryModel;
  }
})();
