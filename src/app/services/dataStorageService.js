(function(){'use strict';
  angular.module('dataInfrastructure').service('dataStorageService', dataStorageService);
  dataStorageService.$inject = ['$http','$q'];
  function dataStorageService($http,$q){
    var self=this;
    self.saveAggregated=saveAggregated; self.getAggregated=getAggregated;
    self.getFreshnessStatus=getFreshnessStatus;
    function saveAggregated(aggregatedData){
      return $http.post('/api/aggregated-data',aggregatedData).then(pick,fail);
    }
    function getAggregated(companyIds){
      return $http.get('/api/aggregated-data',{params:{companyIds:(companyIds||[]).join(',')}}).then(pick,fail);
    }
    function getFreshnessStatus(){
      return $http.get('/api/aggregated-data/freshness').then(pick,fail);
    }
    function pick(res){return res.data;}
    function fail(err){return $q.reject(err);}
  }
})();
