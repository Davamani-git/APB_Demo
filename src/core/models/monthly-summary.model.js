(function () {
    'use strict';

    function MonthlySummaryModel(data) {
        data = data || {};

        this.customerId = data.customerId || '';
        this.accountId = data.accountId || '';
        this.month = data.month || '';
        this.currencyCode = data.currencyCode || 'USD';
        this.totalSpend = typeof data.totalSpend === 'number' ? data.totalSpend : 0;
        this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
        this.averageTransactionAmount = typeof data.averageTransactionAmount === 'number' ? data.averageTransactionAmount : 0;
        this.maxTransactionAmount = typeof data.maxTransactionAmount === 'number' ? data.maxTransactionAmount : 0;
        this.minTransactionAmount = typeof data.minTransactionAmount === 'number' ? data.minTransactionAmount : 0;
        this.lastUpdatedUtc = data.lastUpdatedUtc || null;
        this.breakdown = (data.breakdown || []).map(function (item) {
            return new SpendBreakdownModel(item);
        });
    }

    MonthlySummaryModel.prototype.isEmpty = function () {
        return this.transactionCount === 0;
    };

    MonthlySummaryModelFactory.$inject = ['SpendBreakdownModel'];

    function MonthlySummaryModelFactory(SpendBreakdownModel) {
        return MonthlySummaryModel;
    }

    angular
        .module('app')
        .factory('MonthlySummaryModel', MonthlySummaryModelFactory);
})();
