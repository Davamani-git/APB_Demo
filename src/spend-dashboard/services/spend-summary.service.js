(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .service('SpendSummaryService', SpendSummaryService);

  SpendSummaryService.$inject = ['$http', '$q', '$timeout', 'ENV_CONFIG', 'MonthlySummaryModel', 'ErrorModel', 'LoggerService'];

  function SpendSummaryService($http, $q, $timeout, ENV_CONFIG, MonthlySummaryModel, ErrorModel, LoggerService) {
    var service = {
      getMonthlySummary: getMonthlySummary,
      isMonthInAllowedRange: isMonthInAllowedRange
    };

    var monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

    return service;

    function getMonthlySummary(month) {
      if (!isValidMonthFormat(month)) {
        return $q.reject(new ErrorModel('INVALID_MONTH', 'Month must be in format YYYY-MM.'));
      }
      if (!isMonthInAllowedRange(month)) {
        return $q.reject(new ErrorModel('OUT_OF_RANGE', 'Selected month is outside the allowed range.'));
      }

      if (ENV_CONFIG.useMockApi) {
        return getMonthlySummaryMock(month);
      }

      var config = {
        params: { month: month },
        timeout: ENV_CONFIG.apiTimeoutMs
      };

      var attempt = 0;

      function doRequest() {
        attempt++;
        return $http.get(ENV_CONFIG.apiBaseUrl + '/spend/monthly-summary', config)
          .then(function (response) {
            return new MonthlySummaryModel(response.data || {});
          })
          .catch(function (error) {
            LoggerService.error('Failed to fetch monthly summary', { error: error, attempt: attempt });
            if (ENV_CONFIG.enableClientRetry && attempt <= ENV_CONFIG.maxClientRetries && shouldRetry(error)) {
              return $timeout(doRequest, 1000);
            }
            return $q.reject(mapHttpErrorToErrorModel(error));
          });
      }

      return doRequest();
    }

    function getMonthlySummaryMock(month) {
      var deferred = $q.defer();

      $timeout(function () {
        var now = new Date();
        var mockData = buildMockSummary(month, now);
        deferred.resolve(new MonthlySummaryModel(mockData));
      }, 300);

      return deferred.promise;
    }

    function buildMockSummary(month, now) {
      var monthsWithNoActivity = ['2099-01'];
      var hasActivity = monthsWithNoActivity.indexOf(month) === -1;

      if (!hasActivity) {
        return {
          customerId: 'anon',
          cardReference: 'tokenized-card',
          month: month,
          currency: 'USD',
          totalSpend: 0,
          transactionCount: 0,
          averageTransactionValue: 0,
          breakdown: [],
          lastUpdated: new Date(now.getTime() - 5 * 60000).toISOString(),
          isPreComputed: true,
          dataFreshness: 'FRESH'
        };
      }

      var totalSpend = 1234.56;
      var transactionCount = 42;
      var averageTransactionValue = totalSpend / transactionCount;

      return {
        customerId: 'anon',
        cardReference: 'tokenized-card',
        month: month,
        currency: 'USD',
        totalSpend: totalSpend,
        transactionCount: transactionCount,
        averageTransactionValue: averageTransactionValue,
        breakdown: [
          { label: 'Everyday', amount: 500.0, percentage: 40.5 },
          { label: 'Lifestyle', amount: 350.0, percentage: 28.4 },
          { label: 'Bills', amount: 384.56, percentage: 31.1 }
        ],
        lastUpdated: new Date(now.getTime() - 10 * 60000).toISOString(),
        isPreComputed: true,
        dataFreshness: 'FRESH'
      };
    }

    function isMonthInAllowedRange(month) {
      if (!isValidMonthFormat(month)) {
        return false;
      }
      var parts = month.split('-');
      var year = parseInt(parts[0], 10);
      var monthIndex = parseInt(parts[1], 10) - 1;
      var requestedDate = new Date(year, monthIndex, 1);

      var now = new Date();
      var currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      if (requestedDate > currentMonthStart) {
        return false;
      }

      var monthsDiff = (currentMonthStart.getFullYear() - requestedDate.getFullYear()) * 12 +
        (currentMonthStart.getMonth() - requestedDate.getMonth());

      return monthsDiff <= ENV_CONFIG.maxLookbackMonths;
    }

    function isValidMonthFormat(month) {
      return !!month && monthRegex.test(month);
    }

    function shouldRetry(error) {
      if (!error || typeof error.status === 'undefined') {
        return true;
      }
      return error.status === 0 || (error.status >= 500 && error.status < 600);
    }

    function mapHttpErrorToErrorModel(httpError) {
      if (!httpError) {
        return new ErrorModel('UNKNOWN_ERROR', 'An unexpected error occurred.');
      }
      var status = httpError.status;
      var data = httpError.data || {};
      var code = data.code || 'SERVER_ERROR';
      var message = data.message || 'An error occurred while fetching your summary.';

      if (status === 0) {
        return new ErrorModel('NETWORK_ERROR', 'Unable to reach the server. Please try again.', status, data);
      }
      if (status === 400) {
        return new ErrorModel(code || 'INVALID_REQUEST', message, status, data);
      }
      if (status === 401) {
        return new ErrorModel('UNAUTHORIZED', 'Authentication required. Please sign in again.', status, data);
      }
      if (status === 403) {
        return new ErrorModel('FORBIDDEN', 'You are not allowed to view this data.', status, data);
      }
      if (status === 503) {
        return new ErrorModel(code || 'SERVICE_UNAVAILABLE', message, status, data);
      }

      return new ErrorModel(code, message, status, data);
    }
  }
})();
