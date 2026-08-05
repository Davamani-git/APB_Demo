(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .factory('DashboardSummary', [
      function () {
        function DashboardSummary(data) {
          this.totalCreditLimit = sanitizeNumber(data.totalCreditLimit, 0);
          this.totalOutstanding = sanitizeNumber(data.totalOutstanding, 0);
          this.availableCredit = sanitizeNumber(data.availableCredit, 0);
          this.monthlySpend = data.monthlySpend != null ? sanitizeNumber(data.monthlySpend, 0) : null;
          this.currency = data.currency || 'USD';
          this.asOfDate = data.asOfDate ? new Date(data.asOfDate) : null;
          this.isCached = !!data.isCached;
          this.degraded = !!data.degraded;
          this.lineageId = data.lineageId || '';

          this.computeAvailableCredit();
        }

        DashboardSummary.fromApiResponse = function (payload) {
          var safePayload = payload || {};
          return new DashboardSummary(safePayload);
        };

        DashboardSummary.prototype.computeAvailableCredit = function () {
          var diff = this.totalCreditLimit - this.totalOutstanding;
          if (diff < 0) {
            diff = 0;
          }
          this.availableCredit = diff;
        };

        function sanitizeNumber(value, defaultValue) {
          var num = Number(value);
          if (isNaN(num) || num < 0) {
            return defaultValue;
          }
          return num;
        }

        return DashboardSummary;
      }
    ]);
})();
