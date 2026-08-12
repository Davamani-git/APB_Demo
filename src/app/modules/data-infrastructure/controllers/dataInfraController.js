(function(){'use strict';
  angular.module('dataInfrastructure').controller('dataInfraController', dataInfraController);
  dataInfraController.$inject = ['dataCollectionService','freshnessMonitorService','$scope'];
  function dataInfraController(dataCollectionService,freshnessMonitorService,$scope){
    var vm=this;
    vm.companies=[];
    vm.freshnessData=[];
    vm.collectNow=collectNow;
    vm.startMonitoring=startMonitoring;
    vm.stopMonitoring=stopMonitoring;
    activate();
    function activate(){
      vm.companies=['COMP001','COMP002','COMP003'];
      freshnessMonitorService.startMonitoring();
      $scope.$on('$destroy',function(){freshnessMonitorService.stopMonitoring();});
    }
    function collectNow(){
      vm.loading=true;
      dataCollectionService.collectData(vm.companies).then(function(agg){
        vm.aggregated=agg;
        vm.loading=false;
      }).catch(function(err){
        vm.error=err.message||'Collection failed';
        vm.loading=false;
      });
    }
    function startMonitoring(){
      freshnessMonitorService.startMonitoring();
      vm.monitoringActive=true;
    }
    function stopMonitoring(){
      freshnessMonitorService.stopMonitoring();
      vm.monitoringActive=false;
    }
  }
})();
