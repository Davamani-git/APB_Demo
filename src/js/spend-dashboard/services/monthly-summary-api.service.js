(function () {
  'use strict';

  var useMockData = true;

  MonthlySummaryApiService.$inject = ['$http', '$q', 'ConfigService', 'ErrorHandlingService', 'MonthlySummaryModel', 'SpendBreakdownModel'];

  function MonthlySummaryApiService($http, $q, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    var self = this;

    function buildAvailableMonthsMock(accountId) {
      var response = {
        accountId: accountId,
        months: [
          { year: 2026, month: 5, mode: 'billing' },
          { year: 2026, month: 4, mode: 'billing' },
          { year: 2026, month: 3, mode: 'billing' }
        ],
        maxHistoryMonths: 12
      };
      return response;
    }

    function buildMonthlySummaryMock(accountId, monthContext) {
      var monthString = monthContext.year + '-' + (monthContext.month < 10 ? ('0' + monthContext.month) : monthContext.month);

      var hasData = !(monthContext.year === 2025 && monthContext.month === 1);

      if (!hasData) {
        return {
          noData: true,
          status: 404
        };
      }

      var totalSpend = 1234.56;
      var transactionCount = 42;
      var breakdown = {
        mode: 'category',
        totalAmount: totalSpend,
        categories: [
          { code: 'FOOD', label: 'Food & Dining', amount: 400.0, percentage: 32.4 },
          { code: 'TRAVEL', label: 'Travel', amount: 300.0, percentage: 24.3 },
          { code: 'ONLINE', label: 'Online', amount: 200.0, percentage: 16.2 },
          { code: 'OTHER', label: 'Other', amount: totalSpend - 900.0, percentage: 0.0 }
        ],
        hasPartialData: false
      };

      var summaryPayload = {
        accountId: accountId,
        month: monthString,
        mode: monthContext.mode || 'billing',
        currencyCode: 'USD',
        totalSpend: totalSpend,
        transactionCount: transactionCount,
        averageTransactionValue: totalSpend / transactionCount,
        dataFreshness: {
          asOfDate: '2026-06-01',
          source: 'AggregationStore',
          isApproximate: false
        },
        breakdown: breakdown
      };

      return summaryPayload;
    }

    self.getAvailableMonths = function (accountId) {
      if (useMockData) {
        var mockResponse = buildAvailableMonthsMock(accountId);
        var months = mockResponse.months.map(function (m) {
          return {
            year: m.year,
            month: m.month,
            mode: m.mode
          };
        });
        return $q.resolve(months);
      }

      return ConfigService.ensureLoaded().then(function () {
        var baseUrl = ConfigService.getApiBaseUrl();
        var url = baseUrl + '/api/davms/spend-summary/months';
        return $http.get(url, {
          params: {
            accountId: accountId
          }
        }).then(function (response) {
          var payload = response.data;
          var months = (payload.months || []).map(function (m) {
            return {
              year: m.year,
              month: m.month,
              mode: m.mode
            };
          });
          return months;
        }).catch(function (errorResponse) {
          var errorModel = ErrorHandlingService.classifyHttpError(errorResponse);
          return $q.reject(errorModel);
        });
      });
    };

    self.getMonthlySummary = function (accountId, monthContext) {
      if (useMockData) {
        var summaryPayload = buildMonthlySummaryMock(accountId, monthContext);
        if (summaryPayload && summaryPayload.noData) {
          var errorModel = ErrorHandlingService.classifyHttpError({ status: summaryPayload.status });
          return $q.reject(errorModel);
        }
        var summaryModel = MonthlySummaryModel.create(summaryPayload);
        var breakdownModel = SpendBreakdownModel.create(summaryPayload.breakdown || {});
        return $q.resolve({
          summary: summaryModel,
          breakdown: breakdownModel
        });
      }

      return ConfigService.ensureLoaded().then(function () {
        var baseUrl = ConfigService.getApiBaseUrl();
        var url = baseUrl + '/api/davms/spend-summary';
        var monthString = monthContext.year + '-' + (monthContext.month < 10 ? ('0' + monthContext.month) : monthContext.month);

        return $http.get(url, {
          params: {
            accountId: accountId,
            month: monthString,
            mode: monthContext.mode
          }
        }).then(function (response) {
          var payload = response.data;
          var summaryModel = MonthlySummaryModel.create(payload);
          var breakdownModel = SpendBreakdownModel.create(payload.breakdown || {});
          return {
            summary: summaryModel,
            breakdown: breakdownModel
          };
        }).catch(function (errorResponse) {
          var errorModel = ErrorHandlingService.classifyHttpError(errorResponse);
          return $q.reject(errorModel);
        });
      });
    };
  }

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
