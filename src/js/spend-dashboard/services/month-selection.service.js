(function() {
  'use strict';

  function MonthSelectionService() {
    var service = {
      normalizeMonthSelection: normalizeMonthSelection,
      isMonthSelectable: isMonthSelectable,
      getDefaultMonth: getDefaultMonth
    };

    return service;

    function normalizeMonthSelection(rawValue) {
      if (!rawValue) {
        var now = new Date();
        return {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          mode: 'billing'
        };
      }

      if (typeof rawValue.year === 'number' && typeof rawValue.month === 'number') {
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

      if (typeof rawValue === 'string') {
        var parts = rawValue.split('-');
        if (parts.length === 2) {
          var year = parseInt(parts[0], 10);
          var month = parseInt(parts[1], 10);
          if (!isNaN(year) && !isNaN(month)) {
            return {
              year: year,
              month: month,
              mode: 'billing'
            };
          }
        }
      }

      var fallback = new Date();
      return {
        year: fallback.getFullYear(),
        month: fallback.getMonth() + 1,
        mode: 'billing'
      };
    }

    function isMonthSelectable(rawValue, availableMonths) {
      if (!availableMonths || !availableMonths.length) {
        return true;
      }

      var normalized = normalizeMonthSelection(rawValue);

      for (var i = 0; i < availableMonths.length; i++) {
        var m = availableMonths[i];
        if (m.year === normalized.year && m.month === normalized.month && (m.mode || 'billing') === (normalized.mode || 'billing')) {
          return true;
        }
      }

      return false;
    }

    function getDefaultMonth(availableMonths) {
      if (availableMonths && availableMonths.length) {
        return {
          year: availableMonths[0].year,
          month: availableMonths[0].month,
          mode: availableMonths[0].mode || 'billing'
        };
      }

      var now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        mode: 'billing'
      };
    }
  }

  MonthSelectionService.$inject = [];

  angular.module('davms.spendDashboard')
    .service('MonthSelectionService', MonthSelectionService);
})();
