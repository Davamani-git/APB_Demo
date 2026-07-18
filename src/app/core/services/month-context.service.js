(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('MonthContextService', MonthContextService);

  MonthContextService.$inject = ['EnvConfigService', '$q', 'ErrorModel', 'ERROR_CODES', 'MonthContextModel'];

  function MonthContextService(EnvConfigService, $q, ErrorModel, ERROR_CODES, MonthContextModel) {
    var self = this;

    self.resolveMonthContext = function(month) {
      var deferred = $q.defer();

      EnvConfigService.loadEnvConfig().then(function(env) {
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
          deferred.reject(new ErrorModel({
            code: ERROR_CODES.VALIDATION_ERROR,
            httpStatus: null,
            message: 'Invalid month format.',
            retryable: false
          }));
          return;
        }

        var year = parseInt(month.substring(0, 4), 10);
        var monthIndex = parseInt(month.substring(5, 7), 10) - 1;
        var fromDate = new Date(year, monthIndex, 1);
        var toDate = new Date(year, monthIndex + 1, 0);
        var now = new Date();

        if (fromDate > now) {
          deferred.reject(new ErrorModel({
            code: ERROR_CODES.VALIDATION_ERROR,
            httpStatus: null,
            message: 'Selected month is in the future.',
            retryable: false
          }));
          return;
        }

        var maxLookbackMonths = env.maxLookbackMonths || 24;
        var monthsDiff = (now.getFullYear() - fromDate.getFullYear()) * 12 + (now.getMonth() - fromDate.getMonth());
        if (monthsDiff > maxLookbackMonths) {
          deferred.reject(new ErrorModel({
            code: ERROR_CODES.VALIDATION_ERROR,
            httpStatus: null,
            message: 'Data is not available for the selected month.',
            retryable: false
          }));
          return;
        }

        var context = new MonthContextModel({
          month: month,
          fromDate: fromDate.toISOString().substring(0, 10),
          toDate: toDate.toISOString().substring(0, 10),
          definitionType: 'CALENDAR_MONTH'
        });

        deferred.resolve(context);
      }).catch(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };
  }
})();
