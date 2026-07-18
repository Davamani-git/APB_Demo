(function () {
  'use strict';

  MonthlyDashboardController.$inject = [
    'MonthlySummaryApiService',
    'MonthSelectionService',
    'KpiComputationService',
    'SpendBreakdownMapperService',
    'ErrorHandlingService',
    'LoggingService'
  ];

  function MonthlyDashboardController(
    MonthlySummaryApiService,
    MonthSelectionService,
    KpiComputationService,
    SpendBreakdownMapperService,
    ErrorHandlingService,
    LoggingService
  ) {
    var vm = this;

    vm.availableMonths = [];
    vm.selectedMonth = null;
    vm.summaryModel = null;
    vm.breakdownModel = null;
    vm.kpis = [];
    vm.breakdownSeries = [];
    vm.isLoading = false;
    vm.errorMessage = null;
    vm.breakdownMode = 'tiles';
    vm.accountId = 'CC1234567890';

    vm.init = init;
    vm.onMonthChange = onMonthChange;
    vm.refreshSummary = refreshSummary;
    vm.navigateToInsights = navigateToInsights;

    init();

    function init() {
      vm.isLoading = true;
      LoggingService.info('Initializing monthly dashboard', { accountId: vm.accountId });

      MonthlySummaryApiService.getAvailableMonths(vm.accountId)
        .then(function (months) {
          vm.availableMonths = months;
          vm.selectedMonth = MonthSelectionService.getDefaultMonth(months);
          return vm.refreshSummary();
        })
        .catch(function (errorModel) {
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
        });
    }

    function onMonthChange(selectedMonth) {
      vm.selectedMonth = selectedMonth;
      vm.refreshSummary();
    }

    function refreshSummary() {
      vm.isLoading = true;
      vm.errorMessage = null;

      var normalized = MonthSelectionService.normalizeMonthSelection(vm.selectedMonth);

      MonthlySummaryApiService.getMonthlySummary(vm.accountId, normalized)
        .then(function (result) {
          vm.summaryModel = result.summary;
          vm.breakdownModel = result.breakdown;
          vm.kpis = KpiComputationService.buildKpis(vm.summaryModel);
          vm.breakdownSeries = SpendBreakdownMapperService.toChartSeries(vm.breakdownModel);
          vm.isLoading = false;
        })
        .catch(function (errorModel) {
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.summaryModel = null;
          vm.breakdownModel = null;
          vm.kpis = [];
          vm.breakdownSeries = [];
          vm.isLoading = false;
        });
    }

    function navigateToInsights() {
      LoggingService.info('Navigate to deeper insights requested', {
        accountId: vm.accountId,
        selectedMonth: vm.selectedMonth
      });
      window.alert('Navigation to detailed insights would occur here without exposing transaction-level information.');
    }
  }

  angular.module('davms.spendDashboard')
    .controller('MonthlyDashboardController', MonthlyDashboardController);
})();
