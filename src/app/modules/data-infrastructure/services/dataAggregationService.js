(function(){'use strict';
  angular.module('dataInfrastructure').service('dataAggregationService', dataAggregationService);
  dataAggregationService.$inject = ['dataStorageService','$q'];
  function dataAggregationService(dataStorageService,$q){
    var self=this; self.aggregate=aggregate; self.getAggregated=getAggregated;
    function aggregate(normalizedDataArray){
      var byCompany=_.groupBy(normalizedDataArray,'companyId');
      var results=_.map(byCompany,function(items,companyId){
        var totalCost=_.sumBy(items,'cost');
        var providerBreakdown=_.map(_.groupBy(items,'provider'),function(pItems,provider){
          return {provider:provider,cost:_.sumBy(pItems,'cost')};
        });
        return {companyId:companyId,period:'daily',totalCost:Math.round(totalCost*100)/100,providerBreakdown:providerBreakdown,lastUpdated:new Date(),freshnessStatus:'current'};
      });
      return $q.all(results.map(function(agg){return dataStorageService.saveAggregated(agg);})).then(function(){return results;});
    }
    function getAggregated(companyIds){return dataStorageService.getAggregated(companyIds);}
  }
})();
