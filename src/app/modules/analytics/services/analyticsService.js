(function(){'use strict';
  angular.module('analytics').service('analyticsService', analyticsService);
  analyticsService.$inject = ['$http'];
  function analyticsService($http){
    var self=this;
    self.getTrends=getTrends;
    self.getForecasts=getForecasts;
    function getTrends(companyId,period){
      return $http.get('/api/analytics/trends',{params:{companyId:companyId,period:period}}).then(function(res){return res.data;});
    }
    function getForecasts(companyId){
      return $http.get('/api/analytics/forecasts',{params:{companyId:companyId}}).then(function(res){return res.data;});
    }
  }
})();
