(function () {
    "use strict";

    MonthlySummaryMockService.$inject = ["$q", "MonthlySummaryModel", "ErrorModel"];

    function MonthlySummaryMockService($q, MonthlySummaryModel, ErrorModel) {
        this.getSummary = function (month) {
            var deferred = $q.defer();
            var dataset = window.MonthlySummaryMockData ? window.MonthlySummaryMockData[month] : null;
            if (!dataset) {
                dataset = window.MonthlySummaryMockData ? window.MonthlySummaryMockData["default"] : null;
            }
            if (!dataset) {
                deferred.reject(new ErrorModel(window.ErrorMockData && window.ErrorMockData.NO_MOCK_DATA));
            } else {
                setTimeout(function () {
                    deferred.resolve(new MonthlySummaryModel(dataset));
                }, 500);
            }
            return deferred.promise;
        };
    }

    angular.module("app")
        .service("MonthlySummaryMockService", MonthlySummaryMockService);
})();
