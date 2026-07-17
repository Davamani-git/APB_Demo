(function () {
  'use strict';

  angular.module('app.core')
    .factory('dateUtils', ['envConfig', function (envConfig) {
      function pad(n) {
        return n < 10 ? '0' + n : '' + n;
      }

      function getDefaultMonth() {
        var now = new Date();
        // Default to most recent complete month: previous month if today is not the 1st
        var year = now.getFullYear();
        var month = now.getMonth(); // 0-based
        if (month === 0) {
          year = year - 1;
          month = 12;
        }
        return year + '-' + pad(month);
      }

      function isFutureMonth(monthStr) {
        if (!monthStr) {
          return false;
        }
        var parts = monthStr.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var now = new Date();
        var ref = new Date(year, month, 1);
        var current = new Date(now.getFullYear(), now.getMonth(), 1);
        return ref > current;
      }

      function isWithinAllowedHistory(monthStr, maxMonths) {
        if (!monthStr) {
          return false;
        }
        maxMonths = maxMonths || envConfig.maxHistoryMonths;
        var parts = monthStr.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var target = new Date(year, month, 1);
        var now = new Date();
        var current = new Date(now.getFullYear(), now.getMonth(), 1);
        var diffMonths = (current.getFullYear() - target.getFullYear()) * 12 + (current.getMonth() - target.getMonth());
        return diffMonths >= 0 && diffMonths <= maxMonths;
      }

      return {
        getDefaultMonth: getDefaultMonth,
        isFutureMonth: isFutureMonth,
        isWithinAllowedHistory: isWithinAllowedHistory
      };
    }]);
}());
