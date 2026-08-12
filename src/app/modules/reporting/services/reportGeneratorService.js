(function(){'use strict';
  angular.module('reporting').service('reportGeneratorService', reportGeneratorService);
  reportGeneratorService.$inject = ['$http','$q'];
  function reportGeneratorService($http,$q){
    var self=this;
    self.generateReport=generateReport;
    self.exportReport=exportReport;
    function generateReport(reportType,params){
      return $http.post('/api/reports/generate',{reportType:reportType,params:params}).then(function(res){return res.data;});
    }
    function exportReport(reportId,format){
      return $http.get('/api/reports/'+reportId+'/export',{params:{format:format},responseType:'blob'}).then(function(res){return res.data;});
    }
  }
})();
