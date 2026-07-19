(function () {
    'use strict';

    currencyFormat.$inject = ['$filter'];

    function currencyFormat($filter) {
        return function (value, currencyCode) {
            if (value === null || value === undefined || isNaN(value)) {
                return '-';
            }
            var formatted = $filter('number')(value, 2);
            var code = currencyCode || 'INR';
            return code + ' ' + formatted;
        };
    }

    angular.module('app')
        .filter('currencyFormat', currencyFormat);
})();
