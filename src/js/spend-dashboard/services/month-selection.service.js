(function () {
  'use strict';

  MonthSelectionService.$inject = [];

  function MonthSelectionService() {
    var self = this;

    self.normalizeMonthSelection = function (rawValue) {
      if (!rawValue) {
        var now = new Date();
        return {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          mode: 'billing'
        };
      }

      if (typeof rawValue === 'string') {
        var parts = rawValue.split('-');
        if (parts.length === 2) {
          var year = parseInt(parts[0], 10);
          var month = parseInt(parts[1], 10);
          return {
            year: year,
            month: month,
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

      if (typeof rawValue.year === 'number' && typeof rawValue.month === 'number') {
        return {
          year: rawValue.year,
          month: rawValue.month,
          mode: rawValue.mode || 'billing'
        };
      }

      var nowFallback = new Date();
      return {
        year: nowFallback.getFullYear(),
        month: nowFallback.getMonth() + 1,
        mode: 'billing'
      };
    };

    self.isMonthSelectable = function (rawValue) {
      var context = self.normalizeMonthSelection(rawValue);
      var now = new Date();
      var currentYear = now.getFullYear();
      var currentMonth = now.getMonth() + 1;

      var selectedNumeric = context.year * 12 + context.month;
      var currentNumeric = currentYear * 12 + currentMonth;

      var monthsDiff = currentNumeric - selectedNumeric;
      return monthsDiff >= 0 && monthsDiff <= 12;
    };

    self.getDefaultMonth = function (availableMonths) {
      if (Array.isArray(availableMonths) && availableMonths.length > 0) {
        return {
          year: availableMonths[0].year,
          month: availableMonths[0].month,
          mode: availableMonths[0].mode
        };
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
