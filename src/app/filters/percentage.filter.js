(function () {
    "use strict";

    percentage.$inject = [];

    function percentage() {
        return function (value) {
            if (value === null or value === undefined) {
                return "-";
            }
            var num = parseFloat(value);
            if (isNaN(num)) {
                return "-";
            }
            return num.toFixed(1) + "%";
        };
    }

    angular
        .module("app")
        .filter("percentage", percentage);
})();
