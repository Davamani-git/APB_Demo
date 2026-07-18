(function() {
  'use strict';

  MonthSelectionService.$inject = [];

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

      // rawValue as string YYYY-MM
      if (typeof rawValue === 'string') {
        var parts = rawValue.split('-');
        if (parts.length === 2) {
          return {
            year: parseInt(parts[0], 10),
            month: parseInt(parts[1], 10),
            mode: 'billing'
          };
        }
      }

      var fallback = new Date();
      return {
        year: fallback.getFullYear(),
        month: fallback.getMonth() + 1,
        mode: 'billing'
      };
    };

    this.isMonthSelectable = function(rawValue, availableMonths) {
      var normalized = this.normalizeMonthSelection(rawValue);
      if (Array.isArray(availableMonths) && availableMonths.length > 0) {
        return availableMonths.some(function(m) {
          return m.year === normalized.year && m.month === normalized.month;
        });
      }

      // If availableMonths list not provided, enforce max history from now
      var now = new Date();
      var selectedDate = new Date(normalized.year, normalized.month - 1, 1);
      var diffMonths = (now.getFullYear() - selectedDate.getFullYear()) * 12 + (now.getMonth() - selectedDate.getMonth());
      return diffMonths >= 0 && diffMonths <= MAX_HISTORY_MONTHS;
    };

    this.getDefaultMonth = function(availableMonths) {
      if (Array.isArray(availableMonths) && availableMonths.length > 0) {
        return availableMonths[0];
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
