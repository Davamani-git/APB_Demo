angular.module('apbApp').controller('reportController', ['reportingService', 'authorizationService', 'notificationService', function(reportingService, authorizationService, notificationService) {
  var vm = this;
  vm.companies = [];
  vm.selectedCompany = null;
  vm.reportType = 'summary';
  vm.loadCompanies = function() {
    var assignedIds = authorizationService.getAssignedCompanies();
    vm.companies = assignedIds.map(function(id){ return { id: id, name: 'Company ' + id }; });
  };
  vm.generateReport = function() {
    if (!vm.selectedCompany) { notificationService.warning('Please select a company'); return; }
    reportingService.generateReport(vm.selectedCompany, vm.reportType, {}).then(function(report) {
      notificationService.success('Report generated: ' + report.id);
      vm.reportId = report.id;
    }, function(err) {
      notificationService.error('Failed to generate report');
    });
  };
  vm.exportReport = function(format) {
    if (!vm.reportId) { notificationService.warning('Generate a report first'); return; }
    reportingService.exportReport(vm.reportId, format).then(function(blob) {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'report.' + format;
      a.click();
      notificationService.success('Report exported');
    }, function(err) {
      notificationService.error('Failed to export report');
    });
  };
  vm.loadCompanies();
}]);
