(function() {
  'use strict';

  MonthlySummaryApiService.$inject = ['$http', 'ConfigService', 'ErrorHandlingService', 'MonthlySummaryModel', 'SpendBreakdownModel'];

  function MonthlySummaryApiService($http, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    this.getAvailableMonths = function(accountId) {
      var baseUrl = ConfigService.getApiBaseUrl();
      var url = baseUrl + '/api/davms/spend-summary/months';
      return $http.get(url, {
        params: {
          accountId: accountId
        }
      }).then(function(response) {
        var data = response.data || {};
        var months = Array.isArray(data.months) ? data.months : [];
        return months;
      }).catch(function(error) {
        var errorModel = ErrorHandlingService.classifyHttpError(error);
        return Promise.reject(errorModel);
      });
    };

    this.getMonthlySummary = function(accountId, monthContext) {
      var baseUrl = ConfigService.getApiBaseUrl();
      var url = baseUrl + '/api/davms/spend-summary';
      return $http.get(url, {
        params: {
          accountId: accountId,
          month: monthContext.year + '-' + padMonth(monthContext.month),
          mode: monthContext.mode
        }
      }).then(function(response) {
        var data = response.data || {};
        var summaryModel = MonthlySummaryModel(data);
        var breakdownModel = SpendBreakdownModel(data.breakdown || {});
        return {
          summary: summaryModel,
          breakdown: breakdownModel
        };
      }).catch(function(error) {
        var errorModel = ErrorHandlingService.classifyHttpError(error);
        return Promise.reject(errorModel);
      });
    };

    function padMonth(month) {
      var m = parseInt(month, 10);
      if (isNaN(m) || m < 1 || m > 12) {
        return '01';
      }
      return m < 10 ? '0' + m : '' + m;
    }
  }

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
