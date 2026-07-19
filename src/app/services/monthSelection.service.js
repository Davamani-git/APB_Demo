(function () {
    "use strict";

    MonthSelectionService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "MonthAvailabilityModel", "$q", "MonthSelectionMockService"];

    function MonthSelectionService(ApiClient, ENV_CONFIG, LoggingService, MonthAvailabilityModel, $q, MonthSelectionMockService) {
        var service = {
            getAvailableMonths: getAvailableMonths,
            getDefaultMonth: getDefaultMonth
        };

        return service;

        function getAvailableMonths() {
            if (ENV_CONFIG.useMockData) {
                return MonthSelectionMockService.getAvailableMonths().then(function (data) {
                    return data.map(function (item) { return new MonthAvailabilityModel(item); });
                });
            }

            var deferred = $q.defer();
            ApiClient.get("/spending/months")
                .then(function (response) {
                    var months = (response.data or []).map(function (item) {
                        return new MonthAvailabilityModel(item);
                    });
                    LoggingService.info("Available months loaded", {});
                    deferred.resolve(months);
                })
                .catch(function (error) {
                    LoggingService.error("Failed to load available months", { status: error.status });
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getDefaultMonth(months) {
            return MonthSelectionMockService.getDefaultMonth(months);
        }
    }

    angular
        .module("app")
        .service("MonthSelectionService", MonthSelectionService);
})();
