(function () {
  'use strict';

  angular
    .module('ccd.shared')
    .factory('Card', [
      function () {
        function Card(data) {
          this.id = data.id || '';
          this.maskedNumber = data.maskedNumber || '';
          this.creditLimit = sanitizeNumber(data.creditLimit, 0);
          this.outstanding = sanitizeNumber(data.outstanding, 0);
          this.status = data.status || 'ACTIVE';
          this.utilization = sanitizeNumber(data.utilization, 0);
        }

        function sanitizeNumber(value, defaultValue) {
          var num = Number(value);
          if (isNaN(num) || num < 0) {
            return defaultValue;
          }
          return num;
        }

        return Card;
      }
    ]);
})();
