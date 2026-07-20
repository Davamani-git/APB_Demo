(function () {
    "use strict";

    angular.module("app")
        .filter("percentageFormat", percentageFormatFilter);

    percentageFormatFilter.$inject = [];

    function percentageFormatFilter() {
        return function (value) {
            if (value === null || value === undefined || isNaN(value)) {
                return "-";
            }
            var numericValue = parseFloat(value);
            return numericValue.toFixed(1) + "%";
        };
    }
})();
