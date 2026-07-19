(function () {
    'use strict';

    function MonthlySummaryModel(data) {
        this.month = data.month;
        this.totalSpend = data.totalSpend;
        this.transactionCount = data.transactionCount;
        this.averageTransactionAmount = data.averageTransactionAmount;
        this.currency = data.currency;
        this.isPartial = !!data.isPartial;
        this.dataSource = data.dataSource || null;
    }

    angular.module('app')
        .factory('MonthlySummaryModel', MonthlySummaryModelFactory);

    MonthlySummaryModelFactory.$inject = [];

    function MonthlySummaryModelFactory() {
        return function (data) {
            return new MonthlySummaryModel(data || {});
        };
    }
})();
