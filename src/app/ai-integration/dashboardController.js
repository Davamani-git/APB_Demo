angular.module('apbApp').controller('dashboardController', ['dataAccessService', 'aggregationService', 'dataFreshnessService', 'alertingService', 'authorizationService', 'notificationService', function(dataAccessService, aggregationService, dataFreshnessService, alertingService, authorizationService, notificationService) {
  var vm = this;
  vm.companies = [];
  vm.selectedCompany = null;
  vm.providerData = [];
  vm.totalCost = 0;
  vm.loadCompanies = function() {
    var assignedIds = authorizationService.getAssignedCompanies();
    vm.companies = assignedIds.map(function(id){ return { id: id, name: 'Company ' + id }; });
    if (vm.companies.length > 0) { vm.selectCompany(vm.companies[0].id); }
  };
  vm.selectCompany = function(companyId) {
    vm.selectedCompany = companyId;
    aggregationService.aggregateByProvider(companyId).then(function(data) {
      vm.providerData = data;
      vm.totalCost = data.reduce(function(sum, item){ return sum + item.totalCost; }, 0);
    }, function(err) {
      notificationService.error('Failed to load company data');
    });
  };
  dataFreshnessService.startMonitoring();
  alertingService.startPolling();
  vm.loadCompanies();
}]);
