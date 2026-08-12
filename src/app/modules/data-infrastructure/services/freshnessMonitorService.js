(function(){'use strict';
  angular.module('dataInfrastructure').service('freshnessMonitorService', freshnessMonitorService);
  freshnessMonitorService.$inject = ['$interval','alertService','dataStorageService'];
  function freshnessMonitorService($interval,alertService,dataStorageService){
    var self=this, timer=null, STALE_MS=86400000, CHECK_MS=3600000;
    self.evaluate=evaluate; self.startMonitoring=startMonitoring; self.stopMonitoring=stopMonitoring; self.isStale=isStale;
    function isStale(lastUpdated){
      if(!lastUpdated){return true;}
      return (Date.now()-new Date(lastUpdated).getTime())>STALE_MS;
    }
    function evaluate(){
      return dataStorageService.getFreshnessStatus().then(function(records){
        angular.forEach(records,function(rec){
          var status=(!rec.lastUpdated)?'missing':(isStale(rec.lastUpdated)?'stale':'current');
          rec.freshnessStatus=status;
          if(status!=='current'){alertService.sendFreshnessAlert(rec.companyId,status);}
        });
        return records;
      });
    }
    function startMonitoring(){stopMonitoring();evaluate();timer=$interval(evaluate,CHECK_MS);return timer;}
    function stopMonitoring(){if(timer){$interval.cancel(timer);timer=null;}}
  }
})();
