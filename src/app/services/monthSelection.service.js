(function () {
    "use strict";

    MonthSelectionService.$inject = ["ApiClient", "ENV_CONFIG", "LoggingService", "MonthAvailabilityModel", "$q"];

    function MonthSelectionService(ApiClient, ENV_CONFIG, LoggingService, MonthAvailabilityModel, $q) {
        function buildMonthsUrl() {
            return ENV_CONFIG.apiBaseUrl + "/spending/months";
        }

        function getAvailableMonthsFromApi() {
            var url = buildMonthsUrl();
            return ApiClient.get(url).then(function (response) {
                var data = response.data || [];
                var months = [];
                if (angular.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        months.push(new MonthAvailabilityModel(data[i]));
                    }
                }
                return months;
            });
        }

        function getAvailableMonthsFromMock() {
            return window.MonthSelectionMockService.getAvailableMonths();
        }

        function getAvailableMonths() {
            if (ENV_CONFIG.useMockData) {
                return getAvailableMonthsFromMock();
            }
            return getAvailableMonthsFromApi();
        }

        function getDefaultMonth(months) {
            if (!angular.isArray(months) || months.length === 0) {
                return "";
            }
            for (var i = 0; i < months.length; i++) {
                if (months[i].isCurrent && months[i].hasData) {
                    return months[i].month;
                }
            }
            return months[months.length - 1].month;
        }

        return {
            getAvailableMonths: getAvailableMonths,
            getDefaultMonth: getDefaultMonth
        };
    }

    angular.module("app")
        .service("MonthSelectionService", MonthSelectionService);
}());
