(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .service('DashboardService', ['BaseHttpService', 'ConfigService', '$q', '$cacheFactory', function(BaseHttpService, ConfigService, $q, $cacheFactory){
      var cache = $cacheFactory('dashboardOverviewCache');
      this.getOverview = function(options){
        var opts = options || {};
        var cacheKey = 'overview';
        var cached = cache.get(cacheKey);
        if(cached && !opts.forceRefresh){
          return $q.when(cached);
        }
        var url = ConfigService.getApiBaseUrl() + '/overview';
        return BaseHttpService.get(url).then(function(response){
          var data = response.data || response;
          var normalized = normalizeOverview(data);
          cache.put(cacheKey, normalized);
          return normalized;
        });
      };
      this.invalidateCache = function(){
        cache.removeAll();
      };
      this.toUserMessage = function(error){
        var code = error && error.code;
        switch(code){
          case 'AUTH_REQUIRED':
            return 'Your session has expired. Please log in again.';
          case 'ACCESS_DENIED':
            return 'You are not authorized to view this dashboard.';
          case 'UPSTREAM_UNAVAILABLE':
            return 'Some data is temporarily unavailable. Please try again later.';
          default:
            return 'An unexpected error occurred while loading your dashboard.';
        }
      };
      function normalizeOverview(apiPayload){
        var payload = apiPayload || {};
        var summary = {
          totalCreditLimit: nonNegative(payload.totalCreditLimit),
          totalOutstandingAmount: nonNegative(payload.totalOutstandingAmount),
          totalAvailableCredit: nonNegative(payload.totalAvailableCredit),
          monthlySpend: nonNegative(payload.monthlySpend),
          monthLabel: payload.monthLabel,
          currency: payload.currency || 'INR',
          asOfTimestamp: payload.asOfTimestamp
        };
        return {
          summary: summary,
          cards: Array.isArray(payload.cards) ? payload.cards : [],
          isStale: !!payload.isStale
        };
      }
      function nonNegative(val){
        var num = Number(val);
        if(isNaN(num) || num < 0){
          return 0;
        }
        return num;
      }
    }]);
})();
