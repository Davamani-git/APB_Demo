(function() {
  'use strict';

  MonthlySummaryApiService.$inject = ['$http', '$q', '$timeout', 'ConfigService', 'ErrorHandlingService', 'MonthlySummaryModel', 'SpendBreakdownModel'];

  function MonthlySummaryApiService($http, $q, $timeout, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    var self = this;

    self.getAvailableMonths = getAvailableMonths;
    self.getMonthlySummary = getMonthlySummary;

    function getAvailableMonths(accountId) {
      var useMock = ConfigService.getUseMockData();
      if (useMock) {
        return mockAvailableMonths(accountId);
      }
      var baseUrl = ConfigService.getApiBaseUrl();
      var url = baseUrl + '/api/davms/spend-summary/months';
      return $http.get(url, { params: { accountId: accountId } })
        .then(function(response) {
          var data = response.data || {};
          return Array.isArray(data.months) ? data.months : [];
        })
        .catch(function(response) {
          var errorModel = ErrorHandlingService.classifyHttpError(response);
          return $q.reject(errorModel);
        });
    }

    function getMonthlySummary(accountId, monthContext) {
      var useMock = ConfigService.getUseMockData();
      if (useMock) {
        return mockMonthlySummary(accountId, monthContext);
      }
      var baseUrl = ConfigService.getApiBaseUrl();
      var url = baseUrl + '/api/davms/spend-summary';
      var params = {
        accountId: accountId,
        month: monthContext.year + '-' + padMonth(monthContext.month),
        mode: monthContext.mode
      };
      return $http.get(url, { params: params })
        .then(function(response) {
          var data = response.data || {};
          var summaryModel = MonthlySummaryModel(data);
          var breakdownModel = SpendBreakdownModel(data.breakdown || {});
          return {
            summary: summaryModel,
            breakdown: breakdownModel
          };
        })
        .catch(function(response) {
          var errorModel = ErrorHandlingService.classifyHttpError(response);
          return $q.reject(errorModel);
        });
    }

    function padMonth(m) {
      var s = String(m);
      if (s.length === 1) {
        return '0' + s;
      }
      return s;
    }

    function mockAvailableMonths(accountId) {
      var deferred = $q.defer();
      $timeout(function() {
        if (!accountId) {
          var errorModel = ErrorHandlingService.classifyHttpError({ status: 400 });
          deferred.reject(errorModel);
          return;
        }
        var mock = {
          accountId: accountId,
          months: [
            { year: 2026, month: 5, mode: 'billing' },
            { year: 2026, month: 4, mode: 'billing' },
            { year: 2026, month: 3, mode: 'billing' }
          ],
          maxHistoryMonths: 12
        };
        deferred.resolve(mock.months);
      }, 300);
      return deferred.promise;
    }

    function mockMonthlySummary(accountId, monthContext) {
      var deferred = $q.defer();
      $timeout(function() {
        if (!accountId || !monthContext || !monthContext.year || !monthContext.month) {
          var errorModel = ErrorHandlingService.classifyHttpError({ status: 400 });
          deferred.reject(errorModel);
          return;
        }

        var monthString = monthContext.year + '-' + padMonth(monthContext.month);

        if (monthContext.month === 1 && monthContext.year === 2020) {
          var noDataError = ErrorHandlingService.classifyHttpError({ status: 404 });
          deferred.reject(noDataError);
          return;
        }

        var summaryPayload;
        if (monthContext.month === 5 && monthContext.year === 2026) {
          summaryPayload = {
            accountId: accountId,
            month: monthString,
            mode: monthContext.mode || 'billing',
            currencyCode: 'USD',
            totalSpend: 1234.56,
            transactionCount: 42,
            averageTransactionValue: 29.39,
            dataFreshness: {
              asOfDate: '2026-06-01',
              source: 'AggregationStore',
              isApproximate: false
            },
            breakdown: {
              mode: 'category',
              totalAmount: 1234.56,
              categories: [
                { code: 'FOOD', label: 'Food & Dining', amount: 400.00, percentage: 32.4 },
                { code: 'TRAVEL', label: 'Travel', amount: 300.00, percentage: 24.3 },
                { code: 'ONLINE', label: 'Online', amount: 200.00, percentage: 16.2 },
                { code: 'OTHER', label: 'Other', amount: 334.56, percentage: 27.1 }
              ],
              hasPartialData: false
            }
          };
        } else if (monthContext.month === 4 && monthContext.year === 2026) {
          summaryPayload = {
            accountId: accountId,
            month: monthString,
            mode: monthContext.mode || 'billing',
            currencyCode: 'USD',
            totalSpend: 350.00,
            transactionCount: 10,
            averageTransactionValue: 35.0,
            dataFreshness: {
              asOfDate: '2026-05-01',
              source: 'AggregationStore',
              isApproximate: false
            },
            breakdown: {
              mode: 'category',
              totalAmount: 350.00,
              categories: [
                { code: 'FOOD', label: 'Food & Dining', amount: 150.00, percentage: 42.86 },
                { code: 'ONLINE', label: 'Online', amount: 200.00, percentage: 57.14 }
              ],
              hasPartialData: false
            }
          };
        } else {
          summaryPayload = {
            accountId: accountId,
            month: monthString,
            mode: monthContext.mode || 'billing',
            currencyCode: 'USD',
            totalSpend: 0.0,
            transactionCount: 0,
            averageTransactionValue: 0.0,
            dataFreshness: {
              asOfDate: monthString + '-01',
              source: 'AggregationStore',
              isApproximate: true
            },
            breakdown: {
              mode: 'category',
              totalAmount: 0.0,
              categories: [],
              hasPartialData: false
            }
          };
        }

        var summaryModel = MonthlySummaryModel(summaryPayload);
        var breakdownModel = SpendBreakdownModel(summaryPayload.breakdown || {});

        deferred.resolve({
          summary: summaryModel,
          breakdown: breakdownModel
        });
      }, 300);
      return deferred.promise;
    }
  }

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
