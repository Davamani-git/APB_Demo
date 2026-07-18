(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('MonthSelectionService', MonthSelectionService);

  MonthSelectionService.$inject = ['APP_CONSTANTS'];

  function MonthSelectionService(APP_CONSTANTS) {
    this.resolveDateRange = function(monthValue) {
      var parts = monthValue.split('-');
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10) - 1;
      var start = new Date(year, month, 1);
      var end = new Date(year, month + 1, 0);
      return { startDate: start, endDate: end };
    };

    this.isValidMonth = function(monthValue, maxLookbackMonths) {
      var regex = /^\d{4}-\d{2}$/;
      if (!regex.test(monthValue)) {
        return false;
      }
      var parts = monthValue.split('-');
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10) - 1;
      var selected = new Date(year, month, 1);
      var now = new Date();
      var lookback = new Date(now.getFullYear(), now.getMonth() - maxLookbackMonths, 1);
      return selected >= lookback && selected <= now;
    };
  }
})();
