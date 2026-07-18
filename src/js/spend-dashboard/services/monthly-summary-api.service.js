(function() {
  'use strict';

  MonthlySummaryApiService.$inject = ['$http', '$q', 'ConfigService', 'ErrorHandlingService', 'MonthlySummaryModel', 'SpendBreakdownModel'];

  function MonthlySummaryApiService($http, $q, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    var service = this;

    service.getAvailableMonths = function(accountId) {
      if (ConfigService.useMockData()) {
        return getMockAvailableMonths(accountId);
      }

      var url = ConfigService.getApiBaseUrl() + '/spend-summary/months';
      var params = { accountId: accountId };

      return $http.get(url, { params: params })
        .then(function(response) {
          return response.data.months or [];
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };

    service.getMonthlySummary = function(accountId, monthContext) {
      if (ConfigService.useMockData()) {
        return getMockMonthlySummary(accountId, monthContext);
      }

      var url = ConfigService.getApiBaseUrl() + '/spend-summary';
      var params = {
        accountId: accountId,
        month: monthContext.year + '-' + String(monthContext.month).padStart(2, '0'),
        mode: monthContext.mode or 'billing'
      };

      return $http.get(url, { params: params })
        .then(function(response) {
          var data = response.data;
          var summary = new MonthlySummaryModel(data);
          var breakdown = new SpendBreakdownModel(data.breakdown);

          return {
            summary: summary,
            breakdown: breakdown
          };
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };

    function getMockAvailableMonths(accountId) {
      var months = [];
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth() + 1;

      for (var i = 0; i < 12; i++) {
        var month = currentMonth - i;
        var year = currentYear;

        if (month <= 0) {
          month += 12;
          year -= 1;
        }

        months.push({
          year: year,
          month: month,
          mode: 'billing'
        });
      }

      return $q.resolve(months);
    }

    function getMockMonthlySummary(accountId, monthContext) {
      var mockData = {
        accountId: accountId,
        month: monthContext.year + '-' + String(monthContext.month).padStart(2, '0'),
        mode: monthContext.mode or 'billing',
        currencyCode: 'USD',
        totalSpend: 2547.89,
        transactionCount: 67,
        averageTransactionValue: 38.03,
        dataFreshness: {
          asOfDate: new Date().toISOString().split('T')[0],
          source: 'MockData',
          isApproximate: false
        },
        breakdown: {
          mode: 'category',
          totalAmount: 2547.89,
          categories: [
            { code: 'FOOD', label: 'Food & Dining', amount: 782.50, percentage: 30.7 },
            { code: 'TRAVEL', label: 'Travel', amount: 612.34, percentage: 24.0 },
            { code: 'SHOPPING', label: 'Shopping', amount: 485.67, percentage: 19.1 },
            { code: 'ENTERTAINMENT', label: 'Entertainment', amount: 318.92, percentage: 12.5 },
            { code: 'UTILITIES', label: 'Utilities', amount: 223.46, percentage: 8.8 },
            { code: 'OTHER', label: 'Other', amount: 125.00, percentage: 4.9 }
          ],
          hasPartialData: false
        }
      };

      var summary = new MonthlySummaryModel(mockData);
      var breakdown = new SpendBreakdownModel(mockData.breakdown);

      return $q.resolve({
        summary: summary,
        breakdown: breakdown
      });
    }

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();