(function () {
    'use strict';

    MonthlyTrendPointModel.$inject = [];

    function MonthlyTrendPointModel() {
        function create(month, totalSpend, transactionCount, isEmpty) {
            return {
                month: month,
                totalSpend: totalSpend,
                transactionCount: transactionCount,
                isEmpty: isEmpty
            };
        }

        function createFromResponse(pointData) {
            var month = pointData.month;
            var totalSpend = pointData.totalSpend;
            var transactionCount = pointData.transactionCount;
            var isEmpty = transactionCount === 0;
            return create(month, totalSpend, transactionCount, isEmpty);
        }

        return {
            create: create,
            createFromResponse: createFromResponse
        };
    }

    angular.module('app')
        .service('MonthlyTrendPointModel', MonthlyTrendPointModel);

})();
