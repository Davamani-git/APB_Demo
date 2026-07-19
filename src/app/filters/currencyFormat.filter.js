(function () {
    "use strict";

    currencyFormat.$inject = [];

    function currencyFormat() {
        return function (value, currencyCode) {
            var amount = typeof value === "number" ? value : 0;
            var code = currencyCode || "INR";
            var formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return code + " " + formatted;
        };
    }

    angular.module("app")
        .filter("currencyFormat", currencyFormat);
})();
