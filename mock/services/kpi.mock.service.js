(function () {
    'use strict';

    window.KpiMockService = {
        getKpiConfig: getKpiConfig
    };

    getKpiConfig.$inject = ['$q', '$timeout'];

    function getKpiConfig($q, $timeout) {
        return function () {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(window.KpiMockConfig);
            }, 100);
            return deferred.promise.then(function (raw) {
                return raw;
            });
        };
    }
})();
