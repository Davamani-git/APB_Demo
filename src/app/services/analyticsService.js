angular.module('apbApp').service('analyticsService', ['dataStorageService', function(dataStorageService) {
  this.getTrends = function(companyId, days) {
    return dataStorageService.getStoredData(companyId).then(function(records) {
      var cutoff = Date.now() - (days * 86400000);
      var filtered = (records || []).filter(function(r){ return new Date(r.timestamp).getTime() >= cutoff; });
      var byDay = {};
      filtered.forEach(function(r) {
        var day = new Date(r.timestamp).toISOString().split('T')[0];
        if (!byDay[day]) { byDay[day] = 0; }
        byDay[day] += r.cost;
      });
      return Object.keys(byDay).sort().map(function(d){ return { date: d, cost: byDay[d] }; });
    });
  };
  this.getTopServices = function(companyId, limit) {
    return dataStorageService.getStoredData(companyId).then(function(records) {
      var map = {};
      (records || []).forEach(function(r) {
        var key = r.serviceName;
        if (!map[key]) { map[key] = { serviceName: key, totalCost: 0 }; }
        map[key].totalCost += r.cost;
      });
      return Object.keys(map).map(function(k){ return map[k]; }).sort(function(a,b){ return b.totalCost - a.totalCost; }).slice(0, limit || 10);
    });
  };
}]);
