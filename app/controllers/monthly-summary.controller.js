(function () {
  'use strict';

  angular.module('apbDemo')
    .controller('MonthlySummaryController', MonthlySummaryController);

  MonthlySummaryController.$inject = ['$scope', 'MonthContextService', 'MonthlySummaryService', 'KpiService', 'BreakdownService', 'LoggingService', 'ErrorHandlingService', '$routeParams', 'EnvConfigService', 'monthContext'];

  function MonthlySummaryController($scope, MonthContextService, MonthlySummaryService, KpiService, BreakdownService, LoggingService, ErrorHandlingService, $routeParams, EnvConfigService, monthContext) {
    var vm = this;

    vm.monthContext = monthContext || { months: [], defaultMonth: null };
    vm.selectedMonth = vm.monthContext.defaultMonth || null;
    vm.summary = null;
    vm.kpis = [];
    vm.breakdown = null;

    vm.isLoadingSummary = false;
    vm.isLoadingKpis = false;
    vm.isLoadingBreakdown = false;

    vm.summaryError = null;
    vm.kpiError = null;
    vm.breakdownError = null;

    vm.initialize = initialize;
    vm.onMonthChange = onMonthChange;
    vm.refresh = refresh;
    vm.retrySummary = retrySummary;
    vm.retryKpis = retryKpis;
    vm.retryBreakdown = retryBreakdown;
    vm.navigateToAnalytics = navigateToAnalytics;

    function initialize() {
      if (!vm.selectedMonth && vm.monthContext.months && vm.monthContext.months.length > 0) {
        vm.selectedMonth = vm.monthContext.defaultMonth || vm.monthContext.months[0].month;
      }

      LoggingService.info('MonthlySummaryController initialized', { selectedMonth: vm.selectedMonth });

      loadMonthlySummary();
      loadKpis();
      loadBreakdown();
    }

    function onMonthChange(month) {
      if (!month) {
        vm.summaryError = ErrorHandlingService.createClientValidationError('Please select a valid month.');
        return;
      }

      var isValidMonth = false;
      if (vm.monthContext && vm.monthContext.months) {
        for (var i = 0; i < vm.monthContext.months.length; i++) {
          if (vm.monthContext.months[i].month === month) {
            isValidMonth = true;
            break;
          }
        }
      }

      if (!isValidMonth) {
        vm.summaryError = ErrorHandlingService.createClientValidationError('Selected month is outside the supported range.');
        return;
      }

      vm.selectedMonth = month;
      LoggingService.info('Month changed', { selectedMonth: vm.selectedMonth });

      loadMonthlySummary();
      loadKpis();
      loadBreakdown();
    }

    function refresh() {
      LoggingService.info('Manual refresh triggered', { selectedMonth: vm.selectedMonth });
      loadMonthlySummary();
      loadKpis();
      loadBreakdown();
    }

    function retrySummary() {
      vm.summaryError = null;
      loadMonthlySummary();
    }

    function retryKpis() {
      vm.kpiError = null;
      loadKpis();
    }

    function retryBreakdown() {
      vm.breakdownError = null;
      loadBreakdown();
    }

    function navigateToAnalytics() {
      var analyticsUrl = EnvConfigService.getAnalyticsUrl();
      LoggingService.info('Navigating to analytics', { url: analyticsUrl, selectedMonth: vm.selectedMonth });
      if (analyticsUrl) {
        window.location.href = analyticsUrl + '?month=' + encodeURIComponent(vm.selectedMonth || '');
      }
    }

    function loadMonthlySummary() {
      vm.isLoadingSummary = true;
      vm.summaryError = null;

      MonthlySummaryService.getSummary(vm.selectedMonth)
        .then(function (summaryModel) {
          vm.summary = summaryModel;
          vm.isLoadingSummary = false;
        })
        .catch(function (errorModel) {
          vm.summary = null;
          vm.summaryError = errorModel;
          vm.isLoadingSummary = false;
          LoggingService.error('Failed to load monthly summary', { error: errorModel });
        });
    }

    function loadKpis() {
      vm.isLoadingKpis = true;
      vm.kpiError = null;

      KpiService.getKpis(vm.selectedMonth)
        .then(function (kpiModels) {
          vm.kpis = kpiModels || [];
          vm.isLoadingKpis = false;
        })
        .catch(function (errorModel) {
          vm.kpis = [];
          vm.kpiError = errorModel;
          vm.isLoadingKpis = false;
          LoggingService.error('Failed to load KPIs', { error: errorModel });
        });
    }

    function loadBreakdown() {
      vm.isLoadingBreakdown = true;
      vm.breakdownError = null;

      BreakdownService.getBreakdown(vm.selectedMonth)
        .then(function (breakdownModel) {
          vm.breakdown = breakdownModel;
          vm.isLoadingBreakdown = false;
        })
        .catch(function (errorModel) {
          vm.breakdown = null;
          vm.breakdownError = errorModel;
          vm.isLoadingBreakdown = false;
          LoggingService.error('Failed to load breakdown', { error: errorModel });
        });
    }

    $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
      vm.summaryError = ErrorHandlingService.handleError(rejection, 'Route change to monthly summary failed');
      LoggingService.error('Route change error in MonthlySummaryController', { rejection: rejection });
    });

    initialize();
  }
})();
