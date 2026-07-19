(function () {
    "use strict";

    MonthSelectionService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "MonthAvailabilityModel", "$q"];

    function MonthSelectionService(ApiClient, ENV_CONFIG, LoggingService, MonthAvailabilityModel, $q) {
        this.getAvailableMonths = function () {
            if (ENV_CONFIG.useMockData && window.MonthAvailabilityMockData) {
                return getMockMonths();
            }

            var url = ENV_CONFIG.apiBaseUrl + "/spending/months";
            LoggingService.info("Requesting available months");

            return ApiClient.get(url)
                .then(function (response) {
                    var data = Array.isArray(response.data) ? response.data : [];
                    var models = data.map(function (item) {
                        return new MonthAvailabilityModel(item);
                    });
                    return models;
                });
        };

        this.getDefaultMonth = function (months) {
            if (!months || !months.length) {
                return "";
            }
            var sorted = months.slice().sort(function (a, b) {
                return a.month.localeCompare(b.month);
            });
            return sorted[sorted.length - 1].month;
        };

        function getMockMonths() {
            var deferred = $q.defer();
            setTimeout(function () {
                var data = window.MonthAvailabilityMockData || [];
                var models = data.map(function (item) {
                    return new MonthAvailabilityModel(item);
                });
                deferred.resolve(models);
            }, 300);
            return deferred.promise;
        }
    }

    angular.module("app")
        .service("MonthSelectionService", MonthSelectionService);
})();
