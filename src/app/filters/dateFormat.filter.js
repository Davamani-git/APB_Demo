(function () {
    'use strict';

    function dateFormat() {
        return function (value) {
            if (!value) {
                return '';
            }
            // Expecting YYYY-MM format for months.
            var parts = value.split('-');
            if (parts.length < 2) {
                return value;
            }
            var year = parts[0];
            var monthIndex = parseInt(parts[1], 10) - 1;
            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            if (monthIndex < 0 || monthIndex > 11) {
                return value;
            }
            return monthNames[monthIndex] + ' ' + year;
        };
    }

    angular.module('app')
        .filter('dateFormat', dateFormat);
})();
