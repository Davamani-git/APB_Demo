(function(){'use strict';
  angular.module('dataInfrastructure').service('dataCollectionService', dataCollectionService);
  dataCollectionService.$inject = ['cloudProviderFactory','dataTransformService','dataAggregationService','$interval','$q'];
  function dataCollectionService(cloudProviderFactory,dataTransformService,dataAggregationService,$interval,$q){
    var self=this, timer=null, DEFAULT_INTERVAL=3600000, providers=['aws','azure','gcp'];
    self.collectData=collectData; self.startPolling=startPolling; self.stopPolling=stopPolling;
    function collectData(companyIds,credentialsMap){
      credentialsMap=credentialsMap||{};
      var tasks=[];
      angular.forEach(companyIds,function(companyId){
        angular.forEach(providers,function(provider){
          tasks.push(cloudProviderFactory.fetchUsageData(provider,companyId,credentialsMap[provider])
            .then(function(raw){return dataTransformService.normalize(raw);})
            .catch(function(){return null;}));
        });
      });
      return $q.all(tasks).then(function(normalized){
        var clean=normalized.filter(function(n){return !!n;});
        return dataAggregationService.aggregate(clean);
      });
    }
    function startPolling(companyIds,credentialsMap,intervalMs){
      stopPolling();
      var ms=intervalMs||DEFAULT_INTERVAL;
      timer=$interval(function(){collectData(companyIds,credentialsMap);},ms);
      return timer;
    }
    function stopPolling(){if(timer){$interval.cancel(timer);timer=null;}}
  }
})();
