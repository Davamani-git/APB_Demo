(function () {
    "use strict";

    MonthSelectionMockService.$inject = ["$q", "$timeout", "LoggingService"];

    function MonthSelectionMockService($q, $timeout, LoggingService) {
        var service = {
            getAvailableMonths: getAvailableMonths,
            getDefaultMonth: getDefaultMonth
        };

        return service;

        function getAvailableMonths() {
            var deferred = $q.defer();

            $timeout(function () {
                LoggingService.info("Mock available months loaded", {});
                deferred.resolve(window.MonthAvailabilityMockData);
            }, 400);

            return deferred.promise;
        }

        function getDefaultMonth(months) {
            if (!months || !months.length) {
                return null;
            }
            var current = months.filter(function (m) { return m.isCurrent; });
            if (current.length) {
                return current[0].month;
            }
            return months[months.length - 1].month;
        }
    }

    angular
        .module("app")
        .service("MonthSelectionMockService", MonthSelectionMockService);
})();
