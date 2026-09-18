(function() {
  'use strict';
  angular.module('providerEnrollmentApp').controller('ApplicationListController', ['$scope', '$location', 'ApplicationService', 'ReadinessService', 'AuthService', ApplicationListController]);
  function ApplicationListController($scope, $location, ApplicationService, ReadinessService, AuthService) {
    var vm = this;
    vm.applications = [];
    vm.filters = { status: '', payer: '', coordinator: '', startDate: '' };
    vm.sortBy = 'providerName';
    vm.sortReverse = false;
    vm.loading = false;
    vm.init = function() {
      vm.loading = true;
      AuthService.getCurrentUser().then(function(user) {
        vm.currentUser = user;
        return vm.loadApplications();
      }).finally(function() {
        vm.loading = false;
      });
    };
    vm.loadApplications = function() {
      return ApplicationService.getApplications(vm.filters).then(function(applications) {
        vm.applications = applications.map(function(app) {
          app.overallStatus = vm.calculateOverallStatus(app.payerStatuses);
          return app;
        });
      });
    };
    vm.calculateOverallStatus = function(payerStatuses) {
      if (!payerStatuses || payerStatuses.length === 0) return 'Incomplete';
      var hasIncomplete = payerStatuses.some(function(ps) { return ps.status === 'Incomplete'; });
      if (hasIncomplete) return 'Incomplete';
      var hasExpiring = payerStatuses.some(function(ps) { return ps.status === 'Expiring Soon'; });
      if (hasExpiring) return 'Expiring Soon';
      return 'Ready to Submit';
    };
    vm.applyFilters = function() {
      vm.loadApplications();
    };
    vm.clearFilters = function() {
      vm.filters = { status: '', payer: '', coordinator: '', startDate: '' };
      vm.loadApplications();
    };
    vm.setSortBy = function(field) {
      if (vm.sortBy === field) {
        vm.sortReverse = !vm.sortReverse;
      } else {
        vm.sortBy = field;
        vm.sortReverse = false;
      }
    };
    vm.viewApplication = function(applicationId) {
      $location.path('/applications/' + applicationId);
    };
    vm.init();
  }
  ApplicationListController.$inject = ['$scope', '$location', 'ApplicationService', 'ReadinessService', 'AuthService'];
})();