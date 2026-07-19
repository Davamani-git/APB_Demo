(function () {
    'use strict';

    window.BreakdownMockService = {
        getBreakdown: getBreakdown
    };

    getBreakdown.$inject = ['$q', '$timeout'];

    function getBreakdown($q, $timeout) {
        return function (month) {
            var deferred = $q.defer();
            $timeout(function () {
                var data = window.BreakdownMockData[month] || {
                    month: month,
                    totalSpend: 0,
                    segments: []
                };
                deferred.resolve(data);
            }, 300);
            return deferred.promise.then(function (raw) {
                return raw;
            });
        };
    }
})();
