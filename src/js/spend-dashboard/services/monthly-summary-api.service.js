(function() {
  'use strict';

  function MonthlySummaryApiService($http, $q, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    var mockData = {
      availableMonths: {
        accountId: 'CC1234567890',
        months: [
          { year: 2024, month: 12, mode: 'billing' },
          { year: 2024, month: 11, mode: 'billing' },
          { year: 2024, month: 10, mode: 'billing' },
          { year: 2024, month: 9, mode: 'billing' },
          { year: 2024, month: 8, mode: 'billing' }
        ],
        maxHistoryMonths: 12
      },
      monthlySummary: {
        accountId: 'CC1234567890',
        month: '2024-12',
        mode: 'billing',
        currencyCode: 'USD',
        totalSpend: 2847.65,
        transactionCount: 47,
        averageTransactionValue: 60.59,
        dataFreshness: {
          asOfDate: '2024-12-15',
          source: 'AggregationStore',
          isApproximate: false
        },
        breakdown: {
          mode: 'category',
          totalAmount: 2847.65,
          categories: [
            { code: 'FOOD', label: 'Food & Dining', amount: 856.30, percentage: 30.1 },
            { code: 'TRAVEL', label: 'Travel', amount: 625.40, percentage: 22.0 },
            { code: 'SHOPPING', label: 'Shopping', amount: 512.20, percentage: 18.0 },
            { code: 'ENTERTAINMENT', label: 'Entertainment', amount: 398.75, percentage: 14.0 },
            { code: 'UTILITIES', label: 'Utilities', amount: 284.80, percentage: 10.0 },
            { code: 'OTHER', label: 'Other', amount: 170.20, percentage: 5.9 }
          ],
          hasPartialData: false
        }
      }
    };

    function getAvailableMonths(accountId) {
      if (ConfigService.isMockMode()) {
        return $q.resolve(mockData.availableMonths.months);
      }

      return ConfigService.getApiBaseUrl().then(function(baseUrl) {
        return $http.get(baseUrl + '/spend-summary/months', {
          params: { accountId: accountId }
        });
      }).then(function(response) {
        return response.data.months || [];
      }).catch(function(error) {
        throw ErrorHandlingService.classifyHttpError(error);
      });
    }

    function getMonthlySummary(accountId, monthContext) {
      if (ConfigService.isMockMode()) {
        var mockResponse = angular.copy(mockData.monthlySummary);
        mockResponse.month = monthContext.year + '-' + String(monthContext.month).padStart(2, '0');
        
        return $q.resolve({
          summary: new MonthlySummaryModel(mockResponse),
          breakdown: new SpendBreakdownModel(mockResponse.breakdown)
        });
      }

      return ConfigService.getApiBaseUrl().then(function(baseUrl) {
        var params = {
          accountId: accountId,
          month: monthContext.year + '-' + String(monthContext.month).padStart(2, '0'),
          mode: monthContext.mode || 'billing'
        };

        return $http.get(baseUrl + '/spend-summary', { params: params });
      }).then(function(response) {
        var data = response.data;
        return {
          summary: new MonthlySummaryModel(data),
          breakdown: new SpendBreakdownModel(data.breakdown)
        };
      }).catch(function(error) {
        throw ErrorHandlingService.classifyHttpError(error);
      });
    }

    return {
      getAvailableMonths: getAvailableMonths,
      getMonthlySummary: getMonthlySummary
    };
  }

  MonthlySummaryApiService.$inject = [
    '$http', '$q', 'ConfigService', 'ErrorHandlingService', 
    'MonthlySummaryModel', 'SpendBreakdownModel'
  ];

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();