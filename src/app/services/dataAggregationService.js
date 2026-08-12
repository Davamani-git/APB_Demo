angular.module('apbApp').service('dataAggregationService', ['aggregationService', function(aggregationService) {
  this.getPortfolioSummary = function(companyIds) {
    var promises = (companyIds || []).map(function(id){ return aggregationService.aggregateByProvider(id); });
    return Promise.all(promises).then(function(results) {
      var total = 0;
      results.forEach(function(arr) {
        (arr || []).forEach(function(item){ total += item.totalCost; });
      });
      return { totalCost: total, companyCount: companyIds.length };
    });
  };
}]);
