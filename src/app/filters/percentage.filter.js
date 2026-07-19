(function () {
    "use strict";

    percentage.$inject = ["$filter"];

    function percentage($filter) {
        return function (value, fractionSize) {
            if (typeof value !== "number") {
                return "";
            }
            var size = typeof fractionSize === "number" ? fractionSize : 1;
            var multiplied = value * 100;
            var formatted = $filter("number")(multiplied, size);
            return formatted + "%";
        };
    }

    angular.module("app")
        .filter("percentage", percentage);
}());
