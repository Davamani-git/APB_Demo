(function () {
    'use strict';

    currencySymbol.$inject = [];

    function currencySymbol() {
        return function (inputCurrencyCode) {
            switch (inputCurrencyCode) {
                case 'USD':
                    return '$';
                case 'EUR':
                    return '';
                case 'GBP':
                    return '';
                default:
                    return inputCurrencyCode || '';
            }
        };
    }

    angular
        .module('app')
        .filter('currencySymbol', currencySymbol);
})();
