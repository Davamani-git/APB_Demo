(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .factory('aggregationFactory', ['cloudDataService', '$q', function(cloudDataService, $q) {
      var cachedAggregatedData = null;
      return {
        getAggregatedData: function(forceRefresh) {
          if (cachedAggregatedData && !forceRefresh) {
            return $q.resolve(cachedAggregatedData);
          }
          return cloudDataService.fetchAllUsageData().then(function(rawData) {
            var aggregated = {};
            rawData.forEach(function(item) {
              var companyId = item.companyId || 'unknown';
              if (!aggregated[companyId]) {
                aggregated[companyId] = {
                  companyId: companyId,
                  totalSpend: 0,
                  spendByProvider: {}
                };
              }
              aggregated[companyId].totalSpend += item.cost || 0;
              var provider = item.provider || 'unknown';
              if (!aggregated[companyId].spendByProvider[provider]) {
                aggregated[companyId].spendByProvider[provider] = 0;
              }
              aggregated[companyId].spendByProvider[provider] += item.cost || 0;
            });
            var result = Object.keys(aggregated).map(function(key) {
              return aggregated[key];
            });
            cachedAggregatedData = result;
            return result;
          });
        },
        clearCache: function() {
          cachedAggregatedData = null;
        }
      };
    }]);
})();