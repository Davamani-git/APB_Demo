(function () {
    'use strict';

    window.MonthlySummaryMockService = {
        getSummary: getSummary
    };

    getSummary.$inject = ['$q', '$timeout'];

    function getSummary($q, $timeout) {
        return function (month) {
            var deferred = $q.defer();
            $timeout(function () {
                var data = window.MonthlySummaryMockData[month];
                if (!data) {
                    deferred.reject(window.ErrorMockData.MONTH_NOT_FOUND || {
                        code: 'MONTH_NOT_FOUND',
                        message: 'We could not find spending data for the selected month.',
                        retryable: false
                    });
                } else {
                    deferred.resolve(data);
                }
            }, 300);
            return deferred.promise.then(function (raw) {
                return raw;
            });
        };
    }
})();
