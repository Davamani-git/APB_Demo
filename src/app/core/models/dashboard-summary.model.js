(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .factory('DashboardSummary', DashboardSummaryFactory);

  function DashboardSummaryFactory() {
    function DashboardSummary(opts) {
      opts = opts || {};
      this.totalCreditLimit = Number(opts.totalCreditLimit || 0.0);
      this.totalAvailableCredit = Number(opts.totalAvailableCredit || 0.0);
      this.totalOutstanding = Number(opts.totalOutstanding || 0.0);
      this.monthlySpend = Number(opts.monthlySpend || 0.0);
      this.currency = opts.currency || 'USD';
      this.asOfDate = opts.asOfDate || null;
    }

    return DashboardSummary;
  }
})();
