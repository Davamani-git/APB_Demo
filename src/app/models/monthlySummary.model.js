(function () {
    "use strict";

    function MonthlySummaryModel(data) {
        this.month = data.month;
        this.totalSpend = data.totalSpend;
        this.transactionCount = data.transactionCount;
        this.averageTransactionAmount = data.averageTransactionAmount;
        this.currency = data.currency;
        this.isPartial = !!data.isPartial;
        this.dataSource = data.dataSource;
    }

    MonthlySummaryModel.prototype.isValid = function () {
        return !!this.month && this.totalSpend >= 0 && this.transactionCount >= 0 && this.averageTransactionAmount >= 0 && !!this.currency;
    };

    angular
        .module("app")
        .factory("MonthlySummaryModel", function () { return MonthlySummaryModel; });
})();
