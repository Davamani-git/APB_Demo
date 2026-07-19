(function () {
    "use strict";

    function MonthlySummaryModel(data) {
        data = data || {};
        this.month = data.month || "";
        this.totalSpend = typeof data.totalSpend === "number" ? data.totalSpend : 0;
        this.transactionCount = typeof data.transactionCount === "number" ? data.transactionCount : 0;
        this.averageTransactionAmount = typeof data.averageTransactionAmount === "number" ? data.averageTransactionAmount : 0;
        this.currency = data.currency || "";
        this.isPartial = !!data.isPartial;
        this.dataSource = data.dataSource || "";
    }

    MonthlySummaryModel.prototype.isValid = function () {
        return !!this.month && this.totalSpend >= 0 && this.transactionCount >= 0 && this.averageTransactionAmount >= 0 && !!this.currency;
    };

    angular.module("app")
        .factory("MonthlySummaryModel", function () {
            return MonthlySummaryModel;
        });
}());
