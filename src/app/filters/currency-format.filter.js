(function () {
    'use strict';

    angular.module('apbDemo')
        .filter('currencyFormat', currencyFormat);

    currencyFormat.$inject = [];

    function currencyFormat() {
        return function (value, currencyCode) {
            if (typeof value !== 'number') {
                return '';
            }
            var code = currencyCode || '';
            var formatted = value.toFixed(2);
            if (code) {
                return code + ' ' + formatted;
            }
            return formatted;
        };
    }
})();
