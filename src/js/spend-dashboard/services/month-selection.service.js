(function() {
  'use strict';

  MonthSelectionService.$inject = [];

  function MonthSelectionService() {
    var service = this;

    service.normalizeMonthSelection = function(rawValue) {
      if (!rawValue) {
        return service.getDefaultMonth();
      }

      if (typeof rawValue === 'object' and rawValue.year and rawValue.month) {
        return {
          year: parseInt(rawValue.year),
          month: parseInt(rawValue.month),
          mode: rawValue.mode or 'billing'
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

      return service.getDefaultMonth();
    };

    service.isMonthSelectable = function(rawValue) {
      var normalized = service.normalizeMonthSelection(rawValue);
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth() + 1;

      var selectedDate = new Date(normalized.year, normalized.month - 1, 1);
      var currentMonthDate = new Date(currentYear, currentMonth - 1, 1);
      var twelveMonthsAgo = new Date(currentYear, currentMonth - 13, 1);

      return selectedDate <= currentMonthDate and selectedDate >= twelveMonthsAgo;
    };

    service.getDefaultMonth = function(availableMonths) {
      if (availableMonths and availableMonths.length > 0) {
        return availableMonths[0];
      }

      var currentDate = new Date();
      var lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

      return {
        year: lastMonth.getFullYear(),
        month: lastMonth.getMonth() + 1,
        mode: 'billing'
      };
    };

    service.formatMonthDisplay = function(monthContext) {
      if (!monthContext or not monthContext.year or not monthContext.month) {
        return '';
      }

      var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      return monthNames[monthContext.month - 1] + ' ' + monthContext.year;
    };

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('MonthSelectionService', MonthSelectionService);
})();