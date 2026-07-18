(function() {
  'use strict';

  MonthlySummaryApiService.$inject = ['$http', 'ConfigService', 'ErrorHandlingService', 'MonthlySummaryModel', 'SpendBreakdownModel'];

  function MonthlySummaryApiService($http, ConfigService, ErrorHandlingService, MonthlySummaryModel, SpendBreakdownModel) {
    var basePath = '/api/davms/spend-summary';

    this.getAvailableMonths = function(accountId) {
      var apiBase = ConfigService.getApiBaseUrl();
      var url = apiBase + basePath + '/months';

      return $http.get(url, {
        params: {
          accountId: accountId
        }
      }).then(function(response) {
        var data = response.data || {};
        return data.months || [];
      }).catch(function(rejection) {
        var errorModel = ErrorHandlingService.classifyHttpError(rejection);
        return Promise.reject(errorModel);
      });
    };

    this.getMonthlySummary = function(accountId, monthContext) {
      var apiBase = ConfigService.getApiBaseUrl();
      var url = apiBase + basePath;

      var params = {
        accountId: accountId,
        month: monthContext.year + '-' + padMonth(monthContext.month)
      };
      if (monthContext.mode) {
        params.mode = monthContext.mode;
      }

      return $http.get(url, { params: params }).then(function(response) {
        var data = response.data || {};
        var summary = MonthlySummaryModel(data);
        var breakdown = SpendBreakdownModel(data.breakdown || {});
        return {
          summary: summary,
          breakdown: breakdown
        };
      }).catch(function(rejection) {
        var errorModel = ErrorHandlingService.classifyHttpError(rejection);
        return Promise.reject(errorModel);
      });
    };

    function padMonth(m) {
      var s = String(m);
      return s.length === 1 ? '0' + s : s;
    }
  }

  angular.module('davms.spendDashboard')
    .service('MonthlySummaryApiService', MonthlySummaryApiService);
})();
