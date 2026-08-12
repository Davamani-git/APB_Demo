(function(){'use strict';
  angular.module('analytics').controller('dashboardController', dashboardController);
  dashboardController.$inject = ['dashboardService','analyticsService','budgetAlertService','$scope'];
  function dashboardController(dashboardService,analyticsService,budgetAlertService,$scope){
    var vm=this;
    vm.summary=null;
    vm.companies=[];
    vm.selectedCompany=null;
    vm.selectCompany=selectCompany;
    vm.refresh=refresh;
    activate();
    function activate(){
      budgetAlertService.startMonitoring();
      $scope.$on('$destroy',function(){budgetAlertService.stopMonitoring();});
      refresh();
    }
    function refresh(){
      vm.loading=true;
      dashboardService.getPortfolioSummary().then(function(summary){
        vm.summary=summary;
        vm.companies=summary.companies||[];
        vm.loading=false;
      }).catch(function(err){
        vm.error=err.message||'Failed to load dashboard';
        vm.loading=false;
      });
    }
    function selectCompany(companyId){
      vm.loadingCompany=true;
      dashboardService.getCompanyDetails(companyId).then(function(details){
        vm.selectedCompany=details;
        return analyticsService.getTrends(companyId,'30d');
      }).then(function(trends){
        vm.trends=trends;
        vm.loadingCompany=false;
      }).catch(function(err){
        vm.companyError=err.message||'Failed to load company details';
        vm.loadingCompany=false;
      });
    }
  }
})();
