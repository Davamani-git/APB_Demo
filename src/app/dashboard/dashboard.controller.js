(function() {
  'use strict';
  angular.module('providerEnrollmentApp').controller('DashboardController', ['$scope', 'ReportService', 'ApplicationService', 'AuthService', DashboardController]);
  function DashboardController($scope, ReportService, ApplicationService, AuthService) {
    var vm = this;
    vm.metrics = { readyCount: 0, incompleteCount: 0, expiringCount: 0, totalCount: 0 };
    vm.filters = { coordinator: '', payer: '', dateRange: '' };
    vm.loading = false;
    vm.init = function() {
      vm.loading = true;
      AuthService.getCurrentUser().then(function(user) {
        vm.currentUser = user;
        return vm.loadDashboard();
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.loadDashboard = function() {
      return ReportService.getDashboardMetrics(vm.filters).then(function(metrics) {
        vm.metrics = metrics;
      });
    };
    vm.applyFilters = function() {
      vm.loadDashboard();
    };
    vm.exportReport = function(format) {
      vm.loading = true;
      ReportService.exportApplications(vm.filters, format).then(function(blob) {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'application-report.' + format;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.init();
  }
  DashboardController.$inject = ['$scope', 'ReportService', 'ApplicationService', 'AuthService'];
})();