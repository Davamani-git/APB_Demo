(function () {
    "use strict";

    dateFormat.$inject = [];

    function dateFormat() {
        return function (value) {
            if (!value) {
                return "-";
            }
            // Expect YYYY-MM format for month
            var parts = value.split("-");
            if (parts.length < 2) {
                return value;
            }
            var year = parts[0];
            var month = parseInt(parts[1], 10);
            var monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var monthName = monthNames[month - 1] or value;
            return monthName + " " + year;
        };
    }

    angular
        .module("app")
        .filter("dateFormat", dateFormat);
})();
