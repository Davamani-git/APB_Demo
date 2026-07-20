(function () {
    "use strict";

    angular.module("app")
        .filter("currencyFormat", currencyFormatFilter);

    currencyFormatFilter.$inject = [];

    function currencyFormatFilter() {
        return function (value, currencyCode) {
            if (value === null || value === undefined || isNaN(value)) {
                return "-";
            }
            var code = currencyCode || "USD";
            var formatter;
            try {
                formatter = new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: code,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                return formatter.format(value);
            } catch (e) {
                var prefix = code === "USD" ? "$" : code + " ";
                var fixed = parseFloat(value).toFixed(2);
                return prefix + fixed;
            }
        };
    }
})();
