(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .controller('DashboardController', ['$scope', '$location', 'analyticsService', 'benchmarkingService', 'exportService', 'rbacService', 'auditService', 'authService', function($scope, $location, analyticsService, benchmarkingService, exportService, rbacService, auditService, authService) {
      var vm = this;
      vm.metrics = null;
      vm.benchmarks = null;
      vm.loading = true;
      vm.filters = {
        dateRange: 'month',
        companies: [],
        departments: []
      };
      vm.widgets = [
        {id: 'total-spend', type: 'metric', position: {row: 0, col: 0}, size: {width: 3, height: 1}},
        {id: 'monthly-trend', type: 'chart', position: {row: 1, col: 0}, size: {width: 6, height: 2}},
        {id: 'provider-breakdown', type: 'chart', position: {row: 1, col: 6}, size: {width: 6, height: 2}},
        {id: 'recommendations', type: 'list', position: {row: 3, col: 0}, size: {width: 12, height: 2}}
      ];
      vm.init = function() {
        vm.loadDashboardData();
        auditService.logAction(authService.getCurrentUser().id, 'view_dashboard', 'dashboard', {});
      };
      vm.loadDashboardData = function() {
        vm.loading = true;
        analyticsService.fetchPortfolioMetrics(vm.filters)
          .then(function(metrics) {
            vm.metrics = metrics;
            return benchmarkingService.comparePortfolio(metrics);
          })
          .then(function(benchmarks) {
            vm.benchmarks = benchmarks;
            vm.loading = false;
          })
          .catch(function(error) {
            console.error('Failed to load dashboard data', error);
            vm.loading = false;
          });
      };
      vm.applyFilters = function() {
        vm.loadDashboardData();
      };
      vm.exportReport = function(format) {
        var exportData = {
          metrics: vm.metrics,
          benchmarks: vm.benchmarks,
          filters: vm.filters,
          generatedAt: new Date()
        };
        exportService.generateReport(exportData, format)
          .then(function() {
            auditService.logAction(authService.getCurrentUser().id, 'export_report', 'dashboard', {format: format});
          })
          .catch(function(error) {
            console.error('Export failed', error);
          });
      };
      vm.drillDown = function(companyId) {
        if (rbacService.canAccessCompany(companyId)) {
          $location.path('/company/' + companyId);
        }
      };
      vm.init();
    }]);
})();