(function () {
    "use strict";

    MonthSelectionMockService.$inject = ["$q", "MonthAvailabilityModel"];

    function MonthSelectionMockService($q, MonthAvailabilityModel) {
        this.getAvailableMonths = function () {
            var deferred = $q.defer();
            setTimeout(function () {
                var data = window.MonthAvailabilityMockData || [];
                var models = data.map(function (item) {
                    return new MonthAvailabilityModel(item);
                });
                deferred.resolve(models);
            }, 300);
            return deferred.promise;
        };
    }

    angular.module("app")
        .service("MonthSelectionMockService", MonthSelectionMockService);
})();
