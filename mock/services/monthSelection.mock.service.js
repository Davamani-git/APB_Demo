(function () {
    "use strict";

    window.MonthSelectionMockService = (function () {
        var service = {};

        service.getAvailableMonths = function () {
            var deferred = angular.injector(["ng"]).get("$q").defer();
            var $timeout = angular.injector(["ng"]).get("$timeout");

            var MonthAvailabilityModel = angular.injector(["app"]).get("MonthAvailabilityModel");
            var months = [];
            for (var i = 0; i < window.MonthAvailabilityMockData.length; i++) {
                months.push(new MonthAvailabilityModel(window.MonthAvailabilityMockData[i]));
            }

            $timeout(function () {
                deferred.resolve(months);
            }, 200);

            return deferred.promise;
        };

        return service;
    }());
}());
