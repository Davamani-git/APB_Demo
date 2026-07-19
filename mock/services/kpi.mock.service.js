(function () {
    "use strict";

    window.KpiMockService = (function () {
        var service = {};

        service.getKpiConfig = function () {
            var deferred = angular.injector(["ng"]).get("$q").defer();
            var $timeout = angular.injector(["ng"]).get("$timeout");

            $timeout(function () {
                deferred.resolve(window.KpiMockData.advancedKpis || []);
            }, 150);

            return deferred.promise;
        };

        return service;
    }());
}());
