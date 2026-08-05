(function () {
  'use strict';

  angular
    .module('ccd.shared')
    .factory('TransactionAggregate', [
      function () {
        function TransactionAggregate(data) {
          this.periodLabel = data.periodLabel || '';
          this.totalAmount = sanitizeNumber(data.totalAmount, 0);
          this.currency = data.currency || 'USD';
        }

        function sanitizeNumber(value, defaultValue) {
          var num = Number(value);
          if (isNaN(num) || num < 0) {
            return defaultValue;
          }
          return num;
        }

        return TransactionAggregate;
      }
    ]);
})();
