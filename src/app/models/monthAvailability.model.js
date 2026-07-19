(function () {
    'use strict';

    function MonthAvailabilityModel(data) {
        this.month = data.month;
        this.isCurrent = !!data.isCurrent;
        this.hasData = !!data.hasData;
    }

    angular.module('app')
        .factory('MonthAvailabilityModel', MonthAvailabilityModelFactory);

    MonthAvailabilityModelFactory.$inject = [];

    function MonthAvailabilityModelFactory() {
        return function (data) {
            return new MonthAvailabilityModel(data || {});
        };
    }
})();
