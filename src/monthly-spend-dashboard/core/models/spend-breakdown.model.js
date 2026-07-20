(function () {
  "use strict";

  class SpendBreakdownModel {
    constructor(data) {
      const src = data || {};
      this.month = typeof src.month === "string" ? src.month : "";
      this.currency = typeof src.currency === "string" ? src.currency : "USD";
      const items = Array.isArray(src.items) ? src.items : [];

      this.items = items.map(function (item) {
        return {
          categoryCode: typeof item.categoryCode === "string" ? item.categoryCode : "",
          categoryName: typeof item.categoryName === "string" ? item.categoryName : "",
          amount: typeof item.amount === "number" && item.amount >= 0 ? item.amount : 0,
          percentage: typeof item.percentage === "number" && item.percentage >= 0 && item.percentage <= 100 ? item.percentage : 0
        };
      });
    }
  }

  angular
    .module("app")
    .value("SpendBreakdownModel", SpendBreakdownModel);
}());
