(function () {
  "use strict";

  BreakdownEntry.$inject = [];

  function BreakdownEntry() {
    this.categoryCode = "";
    this.categoryLabel = "";
    this.amount = 0.0;
    this.percentageOfTotal = 0.0;
  }

  BreakdownEntry.prototype.fromDto = function (dto, totalSpend) {
    if (!dto) {
      return this;
    }
    this.categoryCode = dto.categoryCode || "";
    this.categoryLabel = dto.categoryLabel || "";
    this.amount = Number(dto.amount) || 0.0;
    const safeTotal = Number(totalSpend) || 0.0;
    this.percentageOfTotal = safeTotal > 0 ? (this.amount / safeTotal) * 100.0 : 0.0;
    return this;
  };

  angular
    .module("app")
    .factory("BreakdownEntry", function () {
      return BreakdownEntry;
    });
})();
