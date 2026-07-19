(function () {
    "use strict";

    BreakdownService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "BreakdownModel", "$q", "BreakdownMockService"];

    function BreakdownService(ApiClient, ENV_CONFIG, LoggingService, BreakdownModel, $q, BreakdownMockService) {
        var service = {
            getBreakdown: getBreakdown
        };

        return service;

        function getBreakdown(month) {
            if (ENV_CONFIG.useMockData) {
                return BreakdownMockService.getBreakdown(month).then(function (data) {
                    return new BreakdownModel(data);
                });
            }

            var deferred = $q.defer();
            ApiClient.get("/spending/monthly-breakdown", { params: { month: month } })
                .then(function (response) {
                    var model = new BreakdownModel(response.data);
                    LoggingService.info("Breakdown loaded", { month: month });
                    deferred.resolve(model);
                })
                .catch(function (error) {
                    LoggingService.error("Failed to load breakdown", { status: error.status });
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    }

    angular
        .module("app")
        .service("BreakdownService", BreakdownService);
})();
