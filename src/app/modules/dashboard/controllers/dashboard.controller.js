(function() {
  'use strict';

  DashboardController.$inject = [
    '$routeParams',
    'ENV_CONFIG',
    'SummaryService',
    'TrendsService',
    'ConfigService',
    'SummaryMockService',
    'TrendsMockService',
    'ConfigMockRuntimeService',
    'LoggingService',
    'ErrorModel'
  ];

  function DashboardController(
    $routeParams,
    ENV_CONFIG,
    SummaryService,
    TrendsService,
    ConfigService,
    SummaryMockService,
    TrendsMockService,
    ConfigMockRuntimeService,
    LoggingService,
    ErrorModel
  ) {
    var vm = this;

    vm.selectedMonth = '';
    vm.availableMonths = [];
    vm.summary = null;
    vm.trends = null;
    vm.config = null;

    vm.isLoadingSummary = false;
    vm.isLoadingTrends = false;

    vm.summaryError = null;
    vm.trendsError = null;
    vm.validationError = '';

    vm.lastRefreshedAt = null;

    vm.initialize = initialize;
    vm.onMonthChange = onMonthChange;
    vm.retrySummary = retrySummary;
    vm.retryTrends = retryTrends;
    vm.refreshAll = refreshAll;

    initialize();

    function initialize() {
      LoggingService.info('Dashboard initialized');
      setDefaultMonth();
      buildAvailableMonths();
      loadConfig();
      loadMonthlySummary(vm.selectedMonth);
      loadSixMonthTrends();
    }

    function setDefaultMonth() {
      var routeMonth = $routeParams.month;
      if (routeMonth && /^\d{4}-\d{2}$/.test(routeMonth)) {
        vm.selectedMonth = routeMonth;
        return;
      }
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var mm = m < 10 ? '0' + m : '' + m;
      vm.selectedMonth = y + '-' + mm;
    }

    function buildAvailableMonths() {
      var months = [];
      var current = new Date();
      for (var i = 0; i < ENV_CONFIG.maxLookbackMonths; i++) {
        var y = current.getFullYear();
        var m = current.getMonth() + 1;
        var mm = m < 10 ? '0' + m : '' + m;
        months.push(y + '-' + mm);
        current.setMonth(current.getMonth() - 1);
      }
      vm.availableMonths = months;
    }

    function onMonthChange() {
      vm.validationError = '';
      if (!/^\d{4}-\d{2}$/.test(vm.selectedMonth)) {
        vm.validationError = 'Please select a valid month in YYYY-MM format.';
        return;
      }
      var selected = new Date(vm.selectedMonth + '-01');
      var now = new Date();
      if (selected > now) {
        vm.validationError = 'Future months are not available.';
        return;
      }
      loadMonthlySummary(vm.selectedMonth);
      loadSixMonthTrends();
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
    }

    function loadConfig() {
      var svc = ENV_CONFIG.useMockData ? ConfigMockRuntimeService : ConfigService;
      svc.getConfig()
        .then(function(config) {
          vm.config = config;
        })
        .catch(function(error) {
          LoggingService.error('Failed to load config', { error: error });
          vm.config = null;
        });
    }

    function loadMonthlySummary(month) {
      vm.isLoadingSummary = true;
      vm.summaryError = null;

      var svc = ENV_CONFIG.useMockData ? SummaryMockService : SummaryService;

      svc.getMonthlySummary(month)
        .then(function(summary) {
          vm.summary = summary;
          vm.lastRefreshedAt = new Date();
        })
        .catch(function(error) {
          if (error === 'MOCK_MODE') {
            var mockSvc = SummaryMockService;
            mockSvc.getMonthlySummary(month)
              .then(function(summary) {
                vm.summary = summary;
                vm.lastRefreshedAt = new Date();
              })
              .catch(function(e) {
                vm.summaryError = e instanceof ErrorModel ? e : new ErrorModel({ message: 'Unable to load spending summary.' });
              })
              .finally(function() {
                vm.isLoadingSummary = false;
              });
            return;
          }
          vm.summaryError = error instanceof ErrorModel ? error : new ErrorModel({ message: 'Unable to load spending summary.' });
        })
        .finally(function() {
          if (!ENV_CONFIG.useMockData) {
            vm.isLoadingSummary = false;
          }
        });
    }

    function loadSixMonthTrends() {
      vm.isLoadingTrends = true;
      vm.trendsError = null;

      var svc = ENV_CONFIG.useMockData ? TrendsMockService : TrendsService;

      if (ENV_CONFIG.useMockData) {
        svc.getSixMonthTrends(vm.selectedMonth)
          .then(function(trends) {
            vm.trends = trends;
          })
          .catch(function(error) {
            vm.trendsError = error instanceof ErrorModel ? error : new ErrorModel({ message: 'Unable to load spending trends.' });
          })
          .finally(function() {
            vm.isLoadingTrends = false;
          });
        return;
      }

      svc.getSixMonthTrends()
        .then(function(trends) {
          vm.trends = trends;
        })
        .catch(function(error) {
          if (error === 'MOCK_MODE') {
            var mockSvc = TrendsMockService;
            mockSvc.getSixMonthTrends(vm.selectedMonth)
              .then(function(trends) {
                vm.trends = trends;
              })
              .catch(function(e) {
                vm.trendsError = e instanceof ErrorModel ? e : new ErrorModel({ message: 'Unable to load spending trends.' });
              })
              .finally(function() {
                vm.isLoadingTrends = false;
              });
            return;
          }
          vm.trendsError = error instanceof ErrorModel ? error : new ErrorModel({ message: 'Unable to load spending trends.' });
        })
        .finally(function() {
          if (!ENV_CONFIG.useMockData) {
            vm.isLoadingTrends = false;
          }
        });
    }
  }

  angular.module('app')
    .controller('DashboardController', DashboardController);
})();
