(function () {
  'use strict';

  angular
    .module('apbDemo')
    .controller('MonthlySummaryController', MonthlySummaryController);

  MonthlySummaryController.$inject = ['$scope', '$location', '$window', 'monthContext', 'MonthContextService', 'MonthlySummaryService', 'KpiService', 'BreakdownService', 'LoggingService', 'ErrorHandlingService', 'EnvConfigService'];
  function MonthlySummaryController($scope, $location, $window, monthContext, MonthContextService, MonthlySummaryService, KpiService, BreakdownService, LoggingService, ErrorHandlingService, EnvConfigService) {
    var vm = this;

    vm.monthContext = monthContext || { months: [], defaultMonth: '' };
    vm.selectedMonth = vm.monthContext.defaultMonth || '';
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
    vm.isDeeperInsightsEnabled = isDeeperInsightsEnabled;

    initialize();

    function initialize() {
      LoggingService.info('MonthlySummaryController initialized', { defaultMonth: vm.selectedMonth });
      if (!vm.selectedMonth && vm.monthContext.months.length > 0) {
        vm.selectedMonth = vm.monthContext.months[0].month;
      }
      if (vm.selectedMonth) {
        loadAll(vm.selectedMonth);
      }

      $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
        LoggingService.error('Route change error in controller', { rejection: rejection });
      });
    }

    function onMonthChange() {
      if (!vm.selectedMonth) {
        vm.summaryError = ErrorHandlingService.createClientValidationError('Please select a month within the available range.');
        return;
      }
      if (!isMonthAllowed(vm.selectedMonth)) {
        vm.summaryError = ErrorHandlingService.createClientValidationError('Selected month is outside the supported range.');
        return;
      }
      loadAll(vm.selectedMonth);
    }

    function isMonthAllowed(month) {
      if (!vm.monthContext || !Array.isArray(vm.monthContext.months)) {
        return false;
      }
      for (var i = 0; i < vm.monthContext.months.length; i++) {
        if (vm.monthContext.months[i].month === month) {
          return true;
        }
      }
      return false;
    }

    function loadAll(month) {
      loadMonthlySummary(month);
      loadKpis(month);
      loadBreakdown(month);
    }

    function loadMonthlySummary(month) {
      vm.isLoadingSummary = true;
      vm.summaryError = null;
      MonthlySummaryService.getSummary(month).then(function (summary) {
        vm.summary = summary;
      }).catch(function (errorModel) {
        vm.summary = null;
        vm.summaryError = errorModel;
      }).finally(function () {
        vm.isLoadingSummary = false;
      });
    }

    function loadKpis(month) {
      vm.isLoadingKpis = true;
      vm.kpiError = null;
      KpiService.getKpis(month).then(function (kpis) {
        vm.kpis = kpis;
      }).catch(function (errorModel) {
        vm.kpis = [];
        vm.kpiError = errorModel;
      }).finally(function () {
        vm.isLoadingKpis = false;
      });
    }

    function loadBreakdown(month) {
      vm.isLoadingBreakdown = true;
      vm.breakdownError = null;
      BreakdownService.getBreakdown(month).then(function (breakdown) {
        vm.breakdown = breakdown;
      }).catch(function (errorModel) {
        vm.breakdown = null;
        vm.breakdownError = errorModel;
      }).finally(function () {
        vm.isLoadingBreakdown = false;
      });
    }

    function refresh() {
      if (vm.selectedMonth) {
        loadAll(vm.selectedMonth);
      }
    }

    function retrySummary() {
      if (vm.selectedMonth) {
        loadMonthlySummary(vm.selectedMonth);
      }
    }

    function retryKpis() {
      if (vm.selectedMonth) {
        loadKpis(vm.selectedMonth);
      }
    }

    function retryBreakdown() {
      if (vm.selectedMonth) {
        loadBreakdown(vm.selectedMonth);
      }
    }

    function navigateToAnalytics() {
      if (!isDeeperInsightsEnabled()) {
        return;
      }
      var analyticsUrl = '';
      try {
        analyticsUrl = EnvConfigService.getAnalyticsUrl();
      } catch (e) {
        return;
      }
      if (analyticsUrl) {
        var separator = analyticsUrl.indexOf('?') === -1 ? '?' : '&';
        var urlWithParams = analyticsUrl + separator + 'month=' + encodeURIComponent(vm.selectedMonth || '');
        $window.location.href = urlWithParams;
      }
    }

    function isDeeperInsightsEnabled() {
      try {
        var flags = EnvConfigService.getFeatureFlags();
        return !!flags.enableDeeperInsightsNavigation;
      } catch (e) {
        return false;
      }
    }
  }
})();
