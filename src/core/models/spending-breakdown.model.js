(function () {
  "use strict";

  function SpendingBreakdownModelFactory() {
    class SpendingBreakdownModel {
      constructor(data) {
        var source = data || {};
        this.cardId = source.cardId || "";
        this.month = source.month || "";
        this.currency = source.currency || "USD";
        this.categories = Array.isArray(source.categories) ? source.categories.slice() : [];
      }

      getTotal() {
        return this.categories.reduce(function (acc, category) {
          var amount = typeof category.amount === "number" ? category.amount : 0;
          return acc + amount;
        }, 0);
      }

      getCategoriesWithPercentage() {
        var total = this.getTotal();
        if (total <= 0) {
          return this.categories.map(function (category) {
            return {
              name: category.name,
              amount: category.amount,
              percentage: 0
            };
          });
        }
        return this.categories.map(function (category) {
          var amount = typeof category.amount === "number" ? category.amount : 0;
          var percentage = (amount / total) * 100;
          return {
            name: category.name,
            amount: amount,
            percentage: percentage
          };
        });
      }

      toJson() {
        return {
          cardId: this.cardId,
          month: this.month,
          currency: this.currency,
          categories: this.categories.slice()
        };
      }
    }

    return SpendingBreakdownModel;
  }

  angular.module("app")
    .factory("SpendingBreakdownModel", SpendingBreakdownModelFactory);
})();
