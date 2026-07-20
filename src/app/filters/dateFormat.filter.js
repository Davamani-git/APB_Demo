(function () {
    "use strict";

    angular.module("app")
        .filter("dateFormat", dateFormatFilter);

    dateFormatFilter.$inject = [];

    function dateFormatFilter() {
        return function (value) {
            if (!value || typeof value !== "string") {
                return "";
            }
            if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
                var parts = value.split("-");
                var year = parts[0];
                var monthIndex = parseInt(parts[1], 10) - 1;
                var months = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                var monthName = months[monthIndex] || "";
                return monthName + " " + year;
            }
            return value;
        };
    }
})();
