(function () {
    "use strict";

    percentage.$inject = [];

    function percentage() {
        return function (value) {
            var numeric = typeof value === "number" ? value : 0;
            return numeric.toFixed(1) + "%";
        };
    }

    angular.module("app")
        .filter("percentage", percentage);
})();
