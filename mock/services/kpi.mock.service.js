(function () {
    "use strict";

    KpiMockService.$inject = ["$q"];

    function KpiMockService($q) {
        this.getKpiConfig = function () {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.resolve(window.KpiMockConfig || { advancedKpis: [] });
            }, 200);
            return deferred.promise;
        };
    }

    angular.module("app")
        .service("KpiMockService", KpiMockService);
})();
