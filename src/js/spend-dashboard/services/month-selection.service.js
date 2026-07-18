(function() {
  'use strict';

  function MonthSelectionService() {
    var MAX_HISTORY_MONTHS = 12;

    this.normalizeMonthSelection = function(rawValue) {
      if (!rawValue) {
        var now = new Date();
        return {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          mode: 'billing'
        };
      }

      if (rawValue.year && rawValue.month) {
        return {
          year: rawValue.year,
          month: rawValue.month,
          mode: rawValue.mode || 'billing'
        };
      }

      if (rawValue instanceof Date) {
        return {
          year: rawValue.getFullYear(),
          month: rawValue.getMonth() + 1,
          mode: 'billing'
        };
      }

      var parts = String(rawValue).split('-');
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      if (isNaN(year) || isNaN(month)) {
        var fallback = new Date();
        return {
          year: fallback.getFullYear(),
          month: fallback.getMonth() + 1,
          mode: 'billing'
        };
      }
      return {
        year: year,
        month: month,
        mode: 'billing'
      };
    };

    this.isMonthSelectable = function(rawValue) {
      var context = this.normalizeMonthSelection(rawValue);
      var now = new Date();
      var currentYear = now.getFullYear();
      var currentMonth = now.getMonth() + 1;

      var yearDiff = currentYear - context.year;
      var monthDiff = yearDiff * 12 + (currentMonth - context.month);

      if (monthDiff < 0) {
        return false;
      }
      return monthDiff <= MAX_HISTORY_MONTHS;
    };

    this.getDefaultMonth = function(months) {
      if (Array.isArray(months) && months.length > 0) {
        return months[0];
      }
      var now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        mode: 'billing'
      };
    };
  }

  angular.module('davms.spendDashboard')
    .service('MonthSelectionService', MonthSelectionService);
})();
