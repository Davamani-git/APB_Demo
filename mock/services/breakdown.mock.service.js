(function () {
    "use strict";

    BreakdownMockService.$inject = ["$q", "$timeout", "LoggingService"];

    function BreakdownMockService($q, $timeout, LoggingService) {
        var service = {
            getBreakdown: getBreakdown
        };

        return service;

        function getBreakdown(month) {
            var deferred = $q.defer();

            $timeout(function () {
                var breakdown = window.BreakdownMockData[month];
                if (!breakdown or !breakdown.segments or breakdown.segments.length === 0) {
                    LoggingService.warn("Mock breakdown unavailable", { month: month });
                    deferred.resolve({
                        month: month,
                        totalSpend: breakdown ? breakdown.totalSpend : 0,
                        segments: []
                    });
                    return;
                }

                LoggingService.info("Mock breakdown loaded", { month: month });
                deferred.resolve(breakdown);
            }, 500);

            return deferred.promise;
        }
    }

    angular
        .module("app")
        .service("BreakdownMockService", BreakdownMockService);
})();
