(function () {
    "use strict";

    KpiMockService.$inject = ["$q", "$timeout", "LoggingService"];

    function KpiMockService($q, $timeout, LoggingService) {
        var service = {
            getBaseKpis: getBaseKpis
        };

        return service;

        function getBaseKpis() {
            var deferred = $q.defer();

            $timeout(function () {
                LoggingService.info("Mock KPI config loaded", {});
                deferred.resolve(window.KpiMockData.baseKpis);
            }, 300);

            return deferred.promise;
        }
    }

    angular
        .module("app")
        .service("KpiMockService", KpiMockService);
})();
