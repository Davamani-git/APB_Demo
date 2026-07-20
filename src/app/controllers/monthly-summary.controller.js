(function () {
  'use strict';

  angular.module('apbDemo')
    .controller('MonthlySummaryController', MonthlySummaryController);

  MonthlySummaryController.$inject = ['$scope', '$routeParams', 'monthContext', 'MonthContextService', 'MonthlySummaryService', 'KpiService', 'BreakdownService', 'LoggingService', 'ErrorHandlingService', 'EnvConfigService'];

  function MonthlySummaryController($scope, $routeParams, monthContext, MonthContextService, MonthlySummaryService, KpiService, BreakdownService, LoggingService, ErrorHandlingService, EnvConfigService) {
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
      if ($routeParams && $routeParams.month) {
        vm.selectedMonth = $routeParams.month;
      }
      if (!vm.selectedMonth && vm.monthContext.defaultMonth) {
        vm.selectedMonth = vm.monthContext.defaultMonth;
      }
      if (vm.selectedMonth) {
        loadMonthlySummary();
        loadKpis();
        loadBreakdown();
      }
      LoggingService.info('MonthlySummaryController initialized', { selectedMonth: vm.selectedMonth });
    }

    function onMonthChange(month) {
      if (!month) {
        vm.summaryError = ErrorHandlingService.createClientValidationError('Please select a valid month.');
        return;
      }
      if (!MonthContextService.isMonthSelectable(month, vm.monthContext)) {
        vm.summaryError = ErrorHandlingService.createClientValidationError('Selected month is outside the supported range.');
        return;
      }
      vm.selectedMonth = month;
      refresh();
      LoggingService.info('Month changed', { selectedMonth: vm.selectedMonth });
    }

    function refresh() {
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

    function loadMonthlySummary() {
      vm.isLoadingSummary = true;
      vm.summaryError = null;
      MonthlySummaryService.getSummary(vm.selectedMonth).then(function (summaryModel) {
        vm.summary = summaryModel;
        vm.isLoadingSummary = false;
      }).catch(function (error) {
        vm.summaryError = error;
        vm.isLoadingSummary = false;
        LoggingService.error('Failed to load monthly summary', { error: error });
      });
    }

    function loadKpis() {
      vm.isLoadingKpis = true;
      vm.kpiError = null;
      KpiService.getKpis(vm.selectedMonth).then(function (kpiModels) {
        vm.kpis = kpiModels;
        vm.isLoadingKpis = false;
      }).catch(function (error) {
        vm.kpiError = error;
        vm.isLoadingKpis = false;
        LoggingService.error('Failed to load KPIs', { error: error });
      });
    }

    function loadBreakdown() {
      vm.isLoadingBreakdown = true;
      vm.breakdownError = null;
      BreakdownService.getBreakdown(vm.selectedMonth).then(function (breakdownModel) {
        vm.breakdown = breakdownModel;
        vm.isLoadingBreakdown = false;
      }).catch(function (error) {
        vm.breakdownError = error;
        vm.isLoadingBreakdown = false;
        LoggingService.error('Failed to load breakdown', { error: error });
      });
    }

    function navigateToAnalytics() {
      var analyticsUrl = EnvConfigService.getAnalyticsUrl();
      if (!analyticsUrl) {
        // Feature not available
        vm.analyticsUnavailableMessage = 'Deeper insights are currently unavailable for your profile.';
        return;
      }
      window.location.href = analyticsUrl + (analyticsUrl.indexOf('?') === -1 ? '?' : '&') + 'month=' + encodeURIComponent(vm.selectedMonth);
    }

    $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
      vm.summaryError = ErrorHandlingService.handleError(rejection, 'Route change error');
    });

    initialize();
  }
})();
