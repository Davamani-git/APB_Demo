(function () {
  'use strict';

  angular.module('app.core')
    .factory('formattingUtils', [function () {
      function formatCurrency(amount, currency) {
        if (amount === null || amount === undefined || isNaN(amount)) {
          return '-';
        }
        var symbol = currency === 'USD' ? '$' : '';
        return symbol + parseFloat(amount).toFixed(2);
      }

      function formatNumber(value) {
        if (value === null || value === undefined || isNaN(value)) {
          return '-';
        }
        return parseFloat(value).toLocaleString();
      }

      function formatPercentage(value) {
        if (value === null || value === undefined || isNaN(value)) {
          return '-';
        }
        return parseFloat(value).toFixed(1) + '%';
      }

      return {
        formatCurrency: formatCurrency,
        formatNumber: formatNumber,
        formatPercentage: formatPercentage
      };
    }]);
}());
