(function() {
  'use strict';

  MonthSelectionService.$inject = [];

  function MonthSelectionService() {
    var self = this;

    self.normalizeMonthSelection = normalizeMonthSelection;
    self.isMonthSelectable = isMonthSelectable;
    self.getDefaultMonth = getDefaultMonth;

    function normalizeMonthSelection(rawValue) {
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
      if (typeof rawValue === 'string') {
        var parts = rawValue.split('-');
        if (parts.length === 2) {
          var y = parseInt(parts[0], 10);
          var m = parseInt(parts[1], 10);
          if (!isNaN(y) && !isNaN(m)) {
            return {
              year: y,
              month: m,
              mode: 'billing'
            };
          }
        }
      }
      var nowFallback = new Date();
      return {
        year: nowFallback.getFullYear(),
        month: nowFallback.getMonth() + 1,
        mode: 'billing'
      };
    }

    function isMonthSelectable(rawValue) {
      var context = normalizeMonthSelection(rawValue);
      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth() + 1;
      if (context.year > nowYear) {
        return false;
      }
      if (context.year === nowYear && context.month > nowMonth) {
        return false;
      }
      var monthIndexNow = nowYear * 12 + nowMonth;
      var monthIndexSel = context.year * 12 + context.month;
      var diff = monthIndexNow - monthIndexSel;
      return diff >= 0 && diff <= 12;
    }

    function getDefaultMonth(availableMonths) {
      if (Array.isArray(availableMonths) && availableMonths.length > 0) {
        return availableMonths[0];
      }
      var now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        mode: 'billing'
      };
    }
  }

  angular.module('davms.spendDashboard')
    .service('MonthSelectionService', MonthSelectionService);
})();
