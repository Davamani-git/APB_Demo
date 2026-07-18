(function () {
  "use strict";

  MonthlySummary.$inject = ["KpiSummary", "BreakdownEntry"];

  function MonthlySummary(KpiSummary, BreakdownEntry) {
    this.accountId = "";
    this.month = "";
    this.kpiSummary = new KpiSummary();
    this.breakdownEntries = [];
    this.hasData = false;
  }

  MonthlySummary.prototype.fromDto = function (dto) {
    if (!dto) {
      this.hasData = false;
      return this;
    }
    this.accountId = dto.accountId || "";
    this.month = dto.month || "";
    this.kpiSummary = new this.kpiSummary.constructor().fromDto(dto.kpiSummary);
    const totalSpend = this.kpiSummary.totalSpend;
    this.breakdownEntries = [];

    if (Array.isArray(dto.breakdown)) {
      for (let i = 0; i < dto.breakdown.length; i += 1) {
        const entryDto = dto.breakdown[i];
        const entry = new BreakdownEntry().fromDto(entryDto, totalSpend);
        this.breakdownEntries.push(entry);
      }
    }

    this.hasData = true;
    return this;
  };

  angular
    .module("app")
    .factory("MonthlySummary", ["KpiSummary", "BreakdownEntry", function (KpiSummary, BreakdownEntry) {
      return function () {
        return new MonthlySummary(KpiSummary, BreakdownEntry);
      };
    }]);
})();
