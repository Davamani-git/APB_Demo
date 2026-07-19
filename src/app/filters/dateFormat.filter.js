(function () {
    "use strict";

    dateFormat.$inject = [];

    function dateFormat() {
        return function (value) {
            if (!value) {
                return "";
            }

            var parts = value.split("-");
            if (parts.length === 2) {
                var year = parts[0];
                var monthIndex = parseInt(parts[1], 10) - 1;
                var months = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                if (monthIndex >= 0 && monthIndex < months.length) {
                    return months[monthIndex] + " " + year;
                }
            }
            return value;
        };
    }

    angular.module("app")
        .filter("dateFormat", dateFormat);
})();
