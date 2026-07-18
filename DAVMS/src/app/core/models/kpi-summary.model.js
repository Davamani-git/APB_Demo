(function () {
  "use strict";

  KpiSummary.$inject = [];

  function KpiSummary() {
    this.totalSpend = 0.0;
    this.transactionCount = 0;
    this.averageTransactionValue = 0.0;
  }

  KpiSummary.prototype.fromDto = function (dto) {
    if (!dto) {
      return this;
    }
    this.totalSpend = Number(dto.totalSpend) || 0.0;
    this.transactionCount = Number(dto.transactionCount) || 0;
    this.averageTransactionValue = Number(dto.averageTransactionValue) || 0.0;
    return this;
  };

  angular
    .module("app")
    .factory("KpiSummary", function () {
      return KpiSummary;
    });
})();
