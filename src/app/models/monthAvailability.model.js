(function () {
    "use strict";

    function MonthAvailabilityModel(data) {
        data = data || {};
        this.month = data.month || "";
        this.isCurrent = !!data.isCurrent;
        this.hasData = !!data.hasData;
    }

    angular.module("app")
        .factory("MonthAvailabilityModel", function () {
            return MonthAvailabilityModel;
        });
})();
