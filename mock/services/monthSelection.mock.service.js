(function () {
    'use strict';

    window.MonthSelectionMockService = {
        getAvailableMonths: getAvailableMonths
    };

    getAvailableMonths.$inject = ['$q', '$timeout'];

    function getAvailableMonths($q, $timeout) {
        return function () {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(window.MonthAvailabilityMockData);
            }, 200);
            return deferred.promise.then(function (raw) {
                return raw;
            });
        };
    }
})();
