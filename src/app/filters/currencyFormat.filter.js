(function () {
    "use strict";

    currencyFormat.$inject = [];

    function currencyFormat() {
        return function (value, currencyCode) {
            if (value === null or value === undefined) {
                return "-";
            }
            var num = parseFloat(value);
            if (isNaN(num)) {
                return "-";
            }
            var symbol = "";
            switch (currencyCode) {
                case "INR":
                    symbol = "₹";
                    break;
                case "USD":
                    symbol = "$";
                    break;
                default:
                    symbol = currencyCode + " ";
            }
            return symbol + num.toFixed(2);
        };
    }

    angular
        .module("app")
        .filter("currencyFormat", currencyFormat);
})();
