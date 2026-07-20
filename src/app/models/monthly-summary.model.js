(function () {
    'use strict';

    angular.module('apbDemo')
        .factory('MonthlySummaryModel', MonthlySummaryModelFactory);

    MonthlySummaryModelFactory.$inject = [];

    function MonthlySummaryModelFactory() {
        function MonthlySummaryModel() {
            this.month = '';
            this.currency = '';
            this.totalSpend = 0;
            this.transactionCount = 0;
            this.isFinal = false;
            this.isCurrent = false;
            this.breakdownAvailable = false;
        }
        return MonthlySummaryModel;
    }
})();
