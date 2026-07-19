(function () {
  "use strict";

  function SpendingSummaryModelFactory() {
    class SpendingSummaryModel {
      constructor(data) {
        var source = data || {};
        this.cardId = source.cardId || "";
        this.month = source.month || ""; // format YYYY-MM
        this.currency = source.currency || "USD";
        this.totalSpend = typeof source.totalSpend === "number" ? source.totalSpend : 0;
        this.transactionCount = typeof source.transactionCount === "number" ? source.transactionCount : 0;
        this.averageTransactionAmount = typeof source.averageTransactionAmount === "number" ? source.averageTransactionAmount : 0;
        this.maxTransactionAmount = typeof source.maxTransactionAmount === "number" ? source.maxTransactionAmount : 0;
      }

      isEmpty() {
        return !this.cardId || !this.month;
      }

      toJson() {
        return {
          cardId: this.cardId,
          month: this.month,
          currency: this.currency,
          totalSpend: this.totalSpend,
          transactionCount: this.transactionCount,
          averageTransactionAmount: this.averageTransactionAmount,
          maxTransactionAmount: this.maxTransactionAmount
        };
      }
    }

    return SpendingSummaryModel;
  }

  angular.module("app")
    .factory("SpendingSummaryModel", SpendingSummaryModelFactory);
})();
