(function () {
    'use strict';

    function SpendBreakdownModel(data) {
        data = data || {};
        this.categoryCode = data.categoryCode || '';
        this.categoryLabel = data.categoryLabel || '';
        this.totalAmount = typeof data.totalAmount === 'number' ? data.totalAmount : 0;
        this.transactionCount = typeof data.transactionCount === 'number' ? data.transactionCount : 0;
    }

    SpendBreakdownModel.prototype.toChartDataPoint = function () {
        return {
            label: this.categoryLabel,
            value: this.totalAmount
        };
    };

    function SpendBreakdownModelFactory() {
        return SpendBreakdownModel;
    }

    angular
        .module('app')
        .factory('SpendBreakdownModel', SpendBreakdownModelFactory);
})();
