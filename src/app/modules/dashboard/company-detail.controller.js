(function() {
  'use strict';
  angular.module('dashboardModule').controller('companyDetailController', ['$scope', '$routeParams', 'dataAggregationFactory', function($scope, $routeParams, dataAggregationFactory) {
    var vm = this;
    vm.company = null;
    vm.loading = true;
    vm.error = null;
    vm.companyId = $routeParams.companyId;
    vm.init = function() {
      vm.loading = true;
      dataAggregationFactory.getCompanyDetail(vm.companyId).then(function(company) {
        vm.company = company;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load company details: ' + (error.message || 'Unknown error');
        vm.loading = false;
      });
    };
    vm.getDepartmentTotalSpend = function() {
      if (!vm.company || !vm.company.departments) return 0;
      return vm.company.departments.reduce(function(sum, dept) {
        return sum + (dept.spend || 0);
      }, 0);
    };
    vm.init();
  }]);
})();