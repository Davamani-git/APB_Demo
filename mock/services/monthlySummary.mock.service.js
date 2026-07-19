(function () {
    "use strict";

    window.MonthlySummaryMockService = (function () {
        var service = {};

        service.getSummary = function (month) {
            var deferred = angular.injector(["ng"]).get("$q").defer();
            var $timeout = angular.injector(["ng"]).get("$timeout");

            var data = window.MonthlySummaryMockData[month];
            if (!data) {
                $timeout(function () {
                    deferred.reject({ data: window.ErrorMockData.invalidMonth });
                }, 300);
                return deferred.promise;
            }

            $timeout(function () {
                deferred.resolve(new (angular.injector(["app"]).get("MonthlySummaryModel"))(data));
            }, 300);

            return deferred.promise;
        };

        return service;
    }());
}());
