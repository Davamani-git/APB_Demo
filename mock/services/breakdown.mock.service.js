(function () {
    "use strict";

    BreakdownMockService.$inject = ["$q", "BreakdownModel", "ErrorModel"];

    function BreakdownMockService($q, BreakdownModel, ErrorModel) {
        this.getBreakdown = function (month) {
            var deferred = $q.defer();
            var dataset = window.BreakdownMockData ? window.BreakdownMockData[month] : null;
            if (!dataset) {
                dataset = window.BreakdownMockData ? window.BreakdownMockData["default"] : null;
            }
            if (!dataset) {
                deferred.reject(new ErrorModel(window.ErrorMockData && window.ErrorMockData.NO_MOCK_DATA));
            } else {
                setTimeout(function () {
                    deferred.resolve(new BreakdownModel(dataset));
                }, 500);
            }
            return deferred.promise;
        };
    }

    angular.module("app")
        .service("BreakdownMockService", BreakdownMockService);
})();
