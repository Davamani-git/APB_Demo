(function() {
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

    vm.accountId = 'CC1234567890';
    vm.availableMonths = [];
    vm.selectedMonth = null;
    vm.summaryModel = null;
    vm.breakdownModel = null;
    vm.kpis = [];
    vm.breakdownSeries = null;
    vm.breakdownTiles = [];
    vm.isLoading = false;
    vm.errorMessage = null;

    vm.init = init;
    vm.onMonthChange = onMonthChange;
    vm.refreshSummary = refreshSummary;

    init();

    function init() {
      vm.isLoading = true;
      LoggingService.info('Initializing Monthly Dashboard', { accountId: vm.accountId });

      MonthlySummaryApiService.getAvailableMonths(vm.accountId)
        .then(function(months) {
          vm.availableMonths = months;
          vm.selectedMonth = MonthSelectionService.getDefaultMonth(months);
          LoggingService.info('Available months loaded', { count: months.length });
          return refreshSummary();
        })
        .catch(function(err) {
          var errorModel = ErrorHandlingService.classifyHttpError(err);
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          LoggingService.error('Failed to load available months', { error: err });
        });
    }

    function onMonthChange(selectedMonth) {
      vm.selectedMonth = selectedMonth;
      LoggingService.info('Month changed', { month: MonthSelectionService.formatMonthDisplay(selectedMonth) });
      refreshSummary();
    }

    function refreshSummary() {
      vm.isLoading = true;
      vm.errorMessage = null;

      var context = MonthSelectionService.normalizeMonthSelection(vm.selectedMonth);
      LoggingService.info('Refreshing summary', { context: context });

      return MonthlySummaryApiService.getMonthlySummary(vm.accountId, context)
        .then(function(result) {
          vm.summaryModel = result.summary;
          vm.breakdownModel = result.breakdown;

          vm.kpis = KpiComputationService.buildKpis(vm.summaryModel);
          vm.breakdownSeries = SpendBreakdownMapperService.toChartSeries(vm.breakdownModel);
          vm.breakdownTiles = SpendBreakdownMapperService.toTiles(vm.breakdownModel);

          vm.errorMessage = null;
          vm.isLoading = false;

          LoggingService.info('Summary loaded successfully', {
            totalSpend: vm.summaryModel.totalSpend,
            transactionCount: vm.summaryModel.transactionCount
          });
        })
        .catch(function(err) {
          var errorModel = ErrorHandlingService.classifyHttpError(err);
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          LoggingService.error('Failed to load monthly summary', { error: err });
        });
    }
  }

  angular.module('davms.spendDashboard')
    .controller('MonthlyDashboardController', MonthlyDashboardController);
})();