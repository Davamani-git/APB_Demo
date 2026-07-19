(function () {
    "use strict";

    window.BreakdownMockService = (function () {
        var service = {};

        service.getBreakdown = function (month) {
            var deferred = angular.injector(["ng"]).get("$q").defer();
            var $timeout = angular.injector(["ng"]).get("$timeout");
            var BreakdownModel = angular.injector(["app"]).get("BreakdownModel");

            var data = window.BreakdownMockData[month];
            if (!data) {
                $timeout(function () {
                    deferred.resolve(new BreakdownModel({ month: month, totalSpend: 0, segments: [] }));
                }, 250);
                return deferred.promise;
            }

            $timeout(function () {
                deferred.resolve(new BreakdownModel(data));
            }, 250);

            return deferred.promise;
        };

        return service;
    }());
}());
