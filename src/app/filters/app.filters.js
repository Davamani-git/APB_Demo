(function () {
    'use strict';

    angular.module('app')
        .filter('currencyFormat', currencyFormat)
        .filter('dateFormat', dateFormat)
        .filter('percentageFormat', percentageFormat)
        .filter('numberFormat', numberFormat);

    function currencyFormat($filter) {
        return function (input) {
            if (isNaN(input)) return input;
            return $filter('currency')(input, '$', 2);
        };
    }
    currencyFormat.$inject = ['$filter'];

    function dateFormat($filter) {
        return function (input, format) {
            if (!input) return '';
            format = format || 'MMM d, yyyy'; // e.g., Jan 1, 2024
            return $filter('date')(new Date(input), format);
        };
    }
    dateFormat.$inject = ['$filter'];

    function percentageFormat($filter) {
        return function (input, decimals) {
            if (isNaN(input)) return input;
            decimals = angular.isNumber(decimals) ? decimals : 2;
            return $filter('number')(input, decimals) + '%';
        };
    }
    percentageFormat.$inject = ['$filter'];

    function numberFormat($filter) {
        return function (input, decimals) {
            if (isNaN(input)) return input;
            decimals = angular.isNumber(decimals) ? decimals : 0;
            return $filter('number')(input, decimals);
        };
    }
    numberFormat.$inject = ['$filter'];

})();