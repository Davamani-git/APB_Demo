(function () {
  "use strict";

  class SpendSummaryModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.customerId = typeof src.customerId === "string" ? src.customerId : "";
      this.cardId = typeof src.cardId === "string" ? src.cardId : "";
      this.totalSpend = typeof src.totalSpend === "number" && src.totalSpend >= 0 ? src.totalSpend : 0;
      this.currency = typeof src.currency === "string" ? src.currency : "USD";
      this.transactionCount = typeof src.transactionCount === "number" && src.transactionCount >= 0 ? src.transactionCount : 0;
      this.generatedAt = typeof src.generatedAt === "string" ? src.generatedAt : "";
    }
  }

  angular
    .module("app")
    .value("SpendSummaryModel", SpendSummaryModel);
}());
