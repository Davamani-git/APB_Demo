(function() {
  'use strict';

  function MonthSelectionService() {
    function normalizeMonthSelection(rawValue) {
      if (!rawValue) {
        return getDefaultMonth();
      }

      if (typeof rawValue === 'object' && rawValue.year && rawValue.month) {
        return {
          year: parseInt(rawValue.year),
          month: parseInt(rawValue.month),
          mode: rawValue.mode || 'billing'
        };
      }

      if (typeof rawValue === 'string') {
        var parts = rawValue.split('-');
        if (parts.length === 2) {
          return {
            year: parseInt(parts[0]),
            month: parseInt(parts[1]),
            mode: 'billing'
          };
        }
      }

      if (rawValue instanceof Date) {
        return {
          year: rawValue.getFullYear(),
          month: rawValue.getMonth() + 1,
          mode: 'billing'
        };
      }

      return getDefaultMonth();
    }

    function isMonthSelectable(rawValue) {
      var normalized = normalizeMonthSelection(rawValue);
      var now = new Date();
      var currentYear = now.getFullYear();
      var currentMonth = now.getMonth() + 1;
      
      // Don't allow future months
      if (normalized.year > currentYear || 
          (normalized.year === currentYear && normalized.month > currentMonth)) {
        return false;
      }
      
      // Don't allow months older than 12 months
      var monthsAgo = (currentYear - normalized.year) * 12 + (currentMonth - normalized.month);
      return monthsAgo <= 12;
    }

    function getDefaultMonth(availableMonths) {
      if (availableMonths && availableMonths.length > 0) {
        return availableMonths[0];
      }
      
      var now = new Date();
      var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      return {
        year: lastMonth.getFullYear(),
        month: lastMonth.getMonth() + 1,
        mode: 'billing'
      };
    }

    function formatMonthDisplay(monthContext) {
      if (!monthContext) return '';
      
      var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      var monthName = monthNames[monthContext.month - 1] || 'Unknown';
      return monthName + ' ' + monthContext.year;
    }

    return {
      normalizeMonthSelection: normalizeMonthSelection,
      isMonthSelectable: isMonthSelectable,
      getDefaultMonth: getDefaultMonth,
      formatMonthDisplay: formatMonthDisplay
    };
  }

  angular.module('davms.spendDashboard')
    .service('MonthSelectionService', MonthSelectionService);
})();