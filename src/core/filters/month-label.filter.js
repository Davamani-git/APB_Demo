(function () {
    'use strict';

    monthLabel.$inject = [];

    function monthLabel() {
        return function (inputMonthString) {
            if (!inputMonthString || inputMonthString.length !== 7) {
                return inputMonthString || '';
            }
            var parts = inputMonthString.split('-');
            var year = parts[0];
            var monthIndex = parseInt(parts[1], 10) - 1;
            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            if (monthIndex < 0 || monthIndex > 11) {
                return inputMonthString;
            }
            return monthNames[monthIndex] + ' ' + year;
        };
    }

    angular
        .module('app')
        .filter('monthLabel', monthLabel);
})();
