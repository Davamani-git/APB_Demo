(function(){'use strict';
  angular.module('dataInfrastructure').service('alertService', alertService);
  alertService.$inject = ['$http','notificationFactory'];
  function alertService($http,notificationFactory){
    var self=this; self.sendFreshnessAlert=sendFreshnessAlert;
    function sendFreshnessAlert(companyId,status){
      var payload={companyId:companyId,type:'data-freshness',freshnessStatus:status,timestamp:new Date()};
      return $http.post('/api/alerts/freshness',payload).then(function(res){
        notificationFactory.toast('warning','Data for company '+companyId+' is '+status);
        return res.data;
      });
    }
  }
})();
