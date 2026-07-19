(function() {
  'use strict';

  DashboardController.$inject = ['$q', 'SummaryService', 'TrendsService', 'ConfigService', 'SummaryMockService', 'TrendsMockService', 'ConfigMockService', 'ENV_CONFIG', 'LoggingService'];

  function DashboardController($q, SummaryService, TrendsService, ConfigService, SummaryMockService, TrendsMockService, ConfigMockService, ENV_CONFIG, LoggingService) {
    var vm = this;

    vm.selectedMonth = '';
    vm.availableMonths = [];
    vm.summary = new (angular.injector(['ng']).get('Object'))();
    vm.trends = new (angular.injector(['ng']).get('Object'))();
    vm.config = null;
    vm.isLoadingSummary = false;
    vm.isLoadingTrends = false;
    vm.summaryError = null;
    vm.trendsError = null;
    vm.monthValidationError = '';
    vm.refreshTimestamp = '';

    vm.initialize = initialize;
    vm.onMonthChange = onMonthChange;
    vm.retrySummary = retrySummary;
    vm.retryTrends = retryTrends;
    vm.refreshAll = refreshAll;

    vm.initialize();

    function initialize() {
      LoggingService.info('Dashboard initialized');
      vm.availableMonths = buildAvailableMonths();
      vm.selectedMonth = vm.availableMonths[vm.availableMonths.length - 1];
      loadConfig();
      loadMonthlySummary(vm.selectedMonth);
      loadSixMonthTrends();
      vm.refreshTimestamp = buildRefreshTimestamp();
    }

    function buildAvailableMonths() {
      var months = [];
      var today = new Date();
      for (var i = ENV_CONFIG.maxLookbackMonths - 1; i >= 0; i--) {
        var d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var monthStr = year + '-' + (month < 10 ? '0' + month : month);
        months.push(monthStr);
      }
      return months;
    }

    function buildRefreshTimestamp() {
      var d = new Date();
      return d.toISOString();
    }

    function onMonthChange(month) {
      vm.monthValidationError = '';
      if (!validateMonth(month)) {
        vm.monthValidationError = 'Please select a valid month in the format YYYY-MM.';
        LoggingService.warn('Invalid month selected', { month: month });
        return;
      }
      vm.selectedMonth = month;
      loadMonthlySummary(vm.selectedMonth);
    }

    function retrySummary() {
      vm.summaryError = null;
      loadMonthlySummary(vm.selectedMonth);
    }

    function retryTrends() {
      vm.trendsError = null;
      loadSixMonthTrends();
    }

    function refreshAll() {
      loadMonthlySummary(vm.selectedMonth);
      loadSixMonthTrends();
      vm.refreshTimestamp = buildRefreshTimestamp();
    }

    function loadConfig() {
      var service = ENV_CONFIG.useMockData ? ConfigMockService : ConfigService;
      service.getConfig().then(function(model) {
        vm.config = model;
      }).catch(function(error) {
        LoggingService.error('Failed to load config', { code: error && error.code });
        vm.config = null;
      });
    }

    function loadMonthlySummary(month) {
      vm.isLoadingSummary = true;
      vm.summaryError = null;

      var service = ENV_CONFIG.useMockData ? SummaryMockService : SummaryService;
      var promise = service.getMonthlySummary(month);

      $q.when(promise).then(function(model) {
        vm.summary = model;
      }).catch(function(error) {
        vm.summaryError = error;
      }).finally(function() {
        vm.isLoadingSummary = false;
      });
    }

    function loadSixMonthTrends() {
      vm.isLoadingTrends = true;
      vm.trendsError = null;

      var service = ENV_CONFIG.useMockData ? TrendsMockService : TrendsService;
      var promise = service.getSixMonthTrends();

      $q.when(promise).then(function(model) {
        vm.trends = model;
      }).catch(function(error) {
        vm.trendsError = error;
      }).finally(function() {
        vm.isLoadingTrends = false;
      });
    }

    function validateMonth(month) {
      return typeof month === 'string' && /^\d{4}-\d{2}$/.test(month);
    }
  }

  angular.module('app')
    .controller('DashboardController', DashboardController);
})();
