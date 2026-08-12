angular.module('apbApp').service('aggregationService', ['dataStorageService', function(dataStorageService) {
  this.aggregateByProvider = function(companyId) {
    return dataStorageService.getStoredData(companyId).then(function(records) {
      var map = {};
      (records || []).forEach(function(r) {
        if (!map[r.provider]) { map[r.provider] = { provider: r.provider, totalCost: 0, count: 0 }; }
        map[r.provider].totalCost += r.cost;
        map[r.provider].count++;
      });
      return Object.keys(map).map(function(k){ return map[k]; });
    });
  };
  this.aggregateByService = function(companyId) {
    return dataStorageService.getStoredData(companyId).then(function(records) {
      var map = {};
      (records || []).forEach(function(r) {
        var key = r.provider + ':' + r.serviceName;
        if (!map[key]) { map[key] = { provider: r.provider, serviceName: r.serviceName, totalCost: 0, totalUsage: 0 }; }
        map[key].totalCost += r.cost;
        map[key].totalUsage += r.usageAmount;
      });
      return Object.keys(map).map(function(k){ return map[k]; });
    });
  };
}]);
