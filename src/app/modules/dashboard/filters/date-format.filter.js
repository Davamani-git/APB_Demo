(function () {
    'use strict';

    dateFormat.$inject = [];

    function dateFormat() {
        return function (monthString) {
            if (!monthString || monthString.length !== 7) {
                return 'Not available';
            }
            var year = parseInt(monthString.substring(0, 4), 10);
            var month = parseInt(monthString.substring(5, 7), 10) - 1;
            if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
                return 'Not available';
            }
            var date = new Date(year, month, 1);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[date.getMonth()] + ' ' + date.getFullYear();
        };
    }

    angular.module('app')
        .filter('dateFormat', dateFormat);

})();
