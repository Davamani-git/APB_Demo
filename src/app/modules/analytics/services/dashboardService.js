(function(){'use strict';
  angular.module('analytics').service('dashboardService', dashboardService);
  dashboardService.$inject = ['$http','$q'];
  function dashboardService($http,$q){
    var self=this;
    self.getPortfolioSummary=getPortfolioSummary;
    self.getCompanyDetails=getCompanyDetails;
    function getPortfolioSummary(){
      return $http.get('/api/dashboard/portfolio-summary').then(function(res){return res.data;});
    }
    function getCompanyDetails(companyId){
      return $http.get('/api/dashboard/companies/'+companyId).then(function(res){return res.data;});
    }
  }
})();
