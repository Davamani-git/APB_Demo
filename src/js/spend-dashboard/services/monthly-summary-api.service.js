(function() {
  'use strict';

  function MonthlySummaryApiService($http, $q, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    var service = {
      getAvailableMonths: getAvailableMonths,
      getMonthlySummary: getMonthlySummary
    };

    return service;

    function getAvailableMonths(accountId) {
      var useMockData = ConfigService.useMockData();

      if (useMockData) {
        return getAvailableMonthsMock(accountId);
      }

      var baseUrl = ConfigService.getApiBaseUrl();
      var url = baseUrl + '/api/davms/spend-summary/months';

      return $http({
        method: 'GET',
        url: url,
        params: { accountId: accountId }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    }

    function getMonthlySummary(accountId, monthContext) {
      var useMockData = ConfigService.useMockData();

      if (useMockData) {
        return getMonthlySummaryMock(accountId, monthContext);
      }

      var baseUrl = ConfigService.getApiBaseUrl();
      var url = baseUrl + '/api/davms/spend-summary';

      var params = {
        accountId: accountId,
        month: monthContext.year + '-' + padMonth(monthContext.month)
      };

      if (monthContext.mode) {
        params.mode = monthContext.mode;
      }

      return $http({
        method: 'GET',
        url: url,
        params: params
      }).then(function(response) {
        var data = response.data;
        var summaryModel = MonthlySummaryModel.createFromResponse(data);
        var breakdownModel = SpendBreakdownModel.createFromResponse(data.breakdown || {});

        return {
          summary: summaryModel,
          breakdown: breakdownModel
        };
      }).catch(function(error) {
        return $q.reject(error);
      });
    }

    function padMonth(month) {
      return month < 10 ? '0' + month : '' + month;
    }

    function getAvailableMonthsMock(accountId) {
      var deferred = $q.defer();

      var mockResponse = {
        accountId: accountId,
        months: [
          { year: 2026, month: 5, mode: 'billing' },
          { year: 2026, month: 4, mode: 'billing' },
          { year: 2026, month: 3, mode: 'billing' }
        ],
        maxHistoryMonths: 12
      };

      setTimeout(function() {
        deferred.resolve(mockResponse);
      }, 300);

      return deferred.promise;
    }

    function getMonthlySummaryMock(accountId, monthContext) {
      var deferred = $q.defer();

      var monthString = monthContext.year + '-' + padMonth(monthContext.month);

      var hasData = !(monthContext.year === 2025 && monthContext.month === 1);

      var summaryPayload = {
        accountId: accountId,
        month: monthString,
        mode: monthContext.mode || 'billing',
        currencyCode: 'USD',
        totalSpend: hasData ? 1234.56 : 0.0,
        transactionCount: hasData ? 42 : 0,
        averageTransactionValue: hasData ? 29.39 : 0.0,
        dataFreshness: {
          asOfDate: '2026-06-01',
          source: 'MockAggregationStore',
          isApproximate: !hasData
        },
        breakdown: hasData ? {
          mode: 'category',
          totalAmount: 1234.56,
          categories: [
            { code: 'FOOD', label: 'Food & Dining', amount: 400.00, percentage: 32.4 },
            { code: 'TRAVEL', label: 'Travel', amount: 300.00, percentage: 24.3 },
            { code: 'ONLINE', label: 'Online', amount: 200.00, percentage: 16.2 },
            { code: 'OTHER', label: 'Other', amount: 334.56, percentage: 27.1 }
          ],
          hasPartialData: false
        } : {
          mode: 'category',
          totalAmount: 0.0,
          categories: [],
          hasPartialData: false
        }
      };

      setTimeout(function() {
        var summaryModel = MonthlySummaryModel.createFromResponse(summaryPayload);
        var breakdownModel = SpendBreakdownModel.createFromResponse(summaryPayload.breakdown || {});

        deferred.resolve({
          summary: summaryModel,
          breakdown: breakdownModel
        });
      }, 400);

      return deferred.promise;
    }
  }

  MonthlySummaryApiService.$inject = ['$http', '$q', 'ConfigService', 'ErrorHandlingService', 'MonthlySummaryModel', 'SpendBreakdownModel'];

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
