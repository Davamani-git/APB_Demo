(function () {
  'use strict';

  MonthSelectionService.$inject = ['ConfigService', 'MonthContextModel'];

  function MonthSelectionService(ConfigService, MonthContextModel) {
    var service = {
      resolveMonthContext: resolveMonthContext,
      getAvailableMonths: getAvailableMonths
    };
    return service;

    function resolveMonthContext(month) {
      var env = ConfigService.getEnvConfig();
      var maxLookback = env.maxLookbackMonths;
      var now = new Date();

      if (!/^\d{4}-\d{2}$/.test(month)) {
        throw new Error('Invalid month format. Expected YYYY-MM.');
      }

      var parts = month.split('-');
      var yearStr = parts[0];
      var monthStr = parts[1];
      var year = parseInt(yearStr, 10);
      var monthIndex = parseInt(monthStr, 10) - 1; // 0-based
      var selected = new Date(Date.UTC(year, monthIndex, 1));

      var diffMonths = (now.getUTCFullYear() - selected.getUTCFullYear()) * 12 + (now.getUTCMonth() - selected.getUTCMonth());
      if (diffMonths < 0 || diffMonths > maxLookback) {
        throw new Error('Selected month is out of allowed range.');
      }

      var startDate = new Date(Date.UTC(year, monthIndex, 1));
      var endDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));

      return new MonthContextModel({
        requestedMonth: month,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: 'BILLING_CYCLE'
      });
    }

    function getAvailableMonths(currentDate) {
      var env = ConfigService.getEnvConfig();
      var maxLookback = env.maxLookbackMonths;
      var now = currentDate || new Date();
      var months = [];

      for (var i = 0; i <= maxLookback; i++) {
        var date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        var m = (date.getUTCMonth() + 1).toString();
        if (m.length < 2) {
          m = '0' + m;
        }
        var y = date.getUTCFullYear();
        months.push(y + '-' + m);
      }
      return months;
    }
  }

  angular.module('davmsApp')
    .service('MonthSelectionService', MonthSelectionService);
})();
