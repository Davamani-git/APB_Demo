(function () {
    "use strict";

    function dateFormat() {
        return function (value) {
            if (!value) {
                return "";
            }
            if (value.length === 7 && value.indexOf("-") === 4) {
                var parts = value.split("-");
                var year = parts[0];
                var monthNumber = parseInt(parts[1], 10);
                var monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                var monthName = monthNames[monthNumber - 1] || value;
                return monthName + " " + year;
            }
            return value;
        };
    }

    angular.module("app")
        .filter("dateFormat", dateFormat);
}());
