(function () {
    "use strict";

    currencyFormat.$inject = ["$filter"];

    function currencyFormat($filter) {
        return function (value, currencyCode) {
            if (typeof value !== "number") {
                return "";
            }
            var formattedNumber = $filter("number")(value, 2);
            var prefix = "";
            if (currencyCode === "USD") {
                prefix = "$";
            } else if (currencyCode === "EUR") {
                prefix = "€";
            } else if (currencyCode === "INR") {
                prefix = "₹";
            }
            return prefix + formattedNumber;
        };
    }

    angular.module("app")
        .filter("currencyFormat", currencyFormat);
}());
