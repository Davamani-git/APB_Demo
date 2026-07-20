(function () {
    'use strict';

    angular.module('apbDemo')
        .filter('dateFormat', dateFormat);

    dateFormat.$inject = [];

    function dateFormat() {
        return function (monthString) {
            if (!monthString || !/^\d{4}-\d{2}$/.test(monthString)) {
                return '';
            }
            var parts = monthString.split('-');
            var year = parts[0];
            var monthIndex = parseInt(parts[1], 10) - 1;
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var monthLabel = months[monthIndex] || '';
            return monthLabel + ' ' + year;
        };
    }
})();
