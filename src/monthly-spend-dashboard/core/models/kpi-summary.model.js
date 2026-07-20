(function () {
  "use strict";

  class KpiSummaryModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.totalSpend = typeof src.totalSpend === "number" && src.totalSpend >= 0 ? src.totalSpend : 0;
      this.transactionCount = typeof src.transactionCount === "number" && src.transactionCount >= 0 ? src.transactionCount : 0;
      this.averageTransactionAmount = typeof src.averageTransactionAmount === "number" && src.averageTransactionAmount >= 0 ? src.averageTransactionAmount : 0;
      this.maxTransactionAmount = typeof src.maxTransactionAmount === "number" && src.maxTransactionAmount >= 0 ? src.maxTransactionAmount : 0;
    }
  }

  angular
    .module("app")
    .value("KpiSummaryModel", KpiSummaryModel);
}());
