(function () {
  'use strict';

  angular.module('app.core')
    .factory('validationUtils', [function () {
      var MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

      function isValidMonth(month) {
        if (!month || !MONTH_REGEX.test(month)) {
          return false;
        }
        return true;
      }

      return {
        isValidMonth: isValidMonth
      };
    }]);
}());
