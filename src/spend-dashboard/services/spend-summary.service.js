(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .service('SpendSummaryService', SpendSummaryService);

  SpendSummaryService.$inject = ['$http', '$q', 'ENV_CONFIG', 'LoggerService', 'MonthlySummaryModel', 'ErrorModel'];

  function SpendSummaryService($http, $q, ENV_CONFIG, LoggerService, MonthlySummaryModel, ErrorModel) {
    var service = {
      getMonthlySummary: getMonthlySummary,
      isMonthInAllowedRange: isMonthInAllowedRange
    };

    return service;

    function getMonthlySummary(month) {
      if (!isValidMonthFormat(month)) {
        return $q.reject(new ErrorModel('INVALID_MONTH', 'Month must be in format YYYY-MM.'));
      }
      if (!isMonthInAllowedRange(month)) {
        return $q.reject(new ErrorModel('OUT_OF_RANGE', 'Selected month is outside the allowed range.'));
      }

      var config = {
        params: { month: month },
        timeout: ENV_CONFIG.apiTimeoutMs
      };

      return $http.get(ENV_CONFIG.apiBaseUrl + '/spend/monthly-summary', config)
        .then(function (response) {
          LoggerService.info('Monthly summary retrieved', { month: month });
          return new MonthlySummaryModel(response.data || {});
        })
        .catch(function (error) {
          LoggerService.error('Failed to fetch monthly summary', { error: error, month: month });
          return $q.reject(mapHttpErrorToErrorModel(error));
        });
    }

    function isMonthInAllowedRange(month) {
      if (!isValidMonthFormat(month)) {
        return false;
      }
      var parts = month.split('-');
      var year = parseInt(parts[0], 10);
      var monthIndex = parseInt(parts[1], 10) - 1;
      var selectedDate = new Date(year, monthIndex, 1);
      var now = new Date();
      var currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      var diffMonths = (currentMonthStart.getFullYear() - selectedDate.getFullYear()) * 12 + (currentMonthStart.getMonth() - selectedDate.getMonth());
      return diffMonths >= 0 && diffMonths < ENV_CONFIG.maxLookbackMonths;
    }

    function isValidMonthFormat(month) {
      var regex = /^\d{4}-(0[1-9]|1[0-2])$/;
      return regex.test(month);
    }

    function mapHttpErrorToErrorModel(httpError) {
      var status = httpError.status || 0;
      var data = httpError.data || {};
      var code = data.code || 'SERVER_ERROR';
      var message = data.message || 'An error occurred while fetching your summary.';

      if (status === 0) {
        code = 'NETWORK_ERROR';
        message = 'We were unable to reach the server. Please check your connection and try again.';
      } else if (status === 400 && data.code) {
        code = data.code;
      } else if (status === 401) {
        code = 'UNAUTHORIZED';
        message = 'Your session has expired. Please sign in again.';
      } else if (status === 403) {
        code = 'FORBIDDEN';
        message = 'You are not allowed to view this data.';
      } else if (status === 503) {
        code = data.code || 'PARTIAL_DATA';
        message = data.message || 'Showing last available summary. Data may be stale.';
      }

      return new ErrorModel(code, message, status, data);
    }
  }
})();
