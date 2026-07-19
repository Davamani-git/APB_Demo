(function () {
    'use strict';

    currencyFormat.$inject = ['ConfigModel'];

    function currencyFormat(ConfigModel) {
        return function (amount) {
            if (amount === null || amount === undefined || isNaN(amount)) {
                return 'Not available';
            }
            var currencyCode = ConfigModel.getCurrencyCode();
            var symbol = '';
            if (currencyCode === 'INR') {
                symbol = '₹';
            } else if (currencyCode === 'USD') {
                symbol = '$';
            }
            var value = parseFloat(amount).toFixed(2);
            return symbol + value;
        };
    }

    angular.module('app')
        .filter('currencyFormat', currencyFormat);

})();
