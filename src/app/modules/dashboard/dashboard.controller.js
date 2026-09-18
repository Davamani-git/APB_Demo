(function() {
  'use strict';
  angular.module('dashboardModule').controller('dashboardController', ['$scope', 'dataAggregationFactory', 'analyticsService', 'rbacService', 'reportService', function($scope, dataAggregationFactory, analyticsService, rbacService, reportService) {
    var vm = this;
    vm.portfolio = null;
    vm.benchmarks = null;
    vm.recommendations = [];
    vm.loading = true;
    vm.error = null;
    vm.sortBy = 'companyName';
    vm.filterText = '';
    vm.init = function() {
      vm.loading = true;
      dataAggregationFactory.getPortfolioData().then(function(portfolio) {
        vm.portfolio = portfolio;
        vm.benchmarks = analyticsService.computeBenchmarks(portfolio);
        vm.recommendations = analyticsService.generateRecommendations(portfolio);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load portfolio data: ' + (error.message || 'Unknown error');
        vm.loading = false;
      });
    };
    vm.getFilteredCompanies = function() {
      if (!vm.portfolio || !vm.portfolio.companies) return [];
      var companies = vm.portfolio.companies;
      if (vm.filterText) {
        companies = companies.filter(function(c) {
          return c.companyName.toLowerCase().indexOf(vm.filterText.toLowerCase()) !== -1;
        });
      }
      return companies.sort(function(a, b) {
        if (vm.sortBy === 'companyName') {
          return a.companyName.localeCompare(b.companyName);
        } else if (vm.sortBy === 'totalSpend') {
          return b.totalSpend - a.totalSpend;
        }
        return 0;
      });
    };
    vm.exportPDF = function() {
      if (!rbacService.hasPermission('export_reports')) {
        alert('You do not have permission to export reports');
        return;
      }
      reportService.generatePDFReport(vm.portfolio).catch(function(error) {
        alert('Failed to generate PDF report');
      });
    };
    vm.exportExcel = function() {
      if (!rbacService.hasPermission('export_reports')) {
        alert('You do not have permission to export reports');
        return;
      }
      reportService.generateExcelReport(vm.portfolio).catch(function(error) {
        alert('Failed to generate Excel report');
      });
    };
    vm.refreshData = function() {
      dataAggregationFactory.clearCache();
      vm.init();
    };
    vm.init();
  }]);
})();