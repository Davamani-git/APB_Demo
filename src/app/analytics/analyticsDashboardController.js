angular.module('apbApp').controller('analyticsDashboardController', ['analyticsService', 'authorizationService', 'notificationService', function(analyticsService, authorizationService, notificationService) {
  var vm = this;
  vm.companies = [];
  vm.selectedCompany = null;
  vm.trends = [];
  vm.topServices = [];
  vm.loadCompanies = function() {
    var assignedIds = authorizationService.getAssignedCompanies();
    vm.companies = assignedIds.map(function(id){ return { id: id, name: 'Company ' + id }; });
    if (vm.companies.length > 0) { vm.selectCompany(vm.companies[0].id); }
  };
  vm.selectCompany = function(companyId) {
    vm.selectedCompany = companyId;
    analyticsService.getTrends(companyId, 30).then(function(data) {
      vm.trends = data;
    }, function(err) {
      notificationService.error('Failed to load trends');
    });
    analyticsService.getTopServices(companyId, 5).then(function(data) {
      vm.topServices = data;
    }, function(err) {
      notificationService.error('Failed to load top services');
    });
  };
  vm.loadCompanies();
}]);
