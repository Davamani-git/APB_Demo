(function() {
  'use strict';

  class MonthlyDashboardController {
    constructor(MonthlySummaryApiService,
                MonthSelectionService,
                KpiComputationService,
                SpendBreakdownMapperService,
                ErrorHandlingService,
                LoggingService) {
      this.MonthlySummaryApiService = MonthlySummaryApiService;
      this.MonthSelectionService = MonthSelectionService;
      this.KpiComputationService = KpiComputationService;
      this.SpendBreakdownMapperService = SpendBreakdownMapperService;
      this.ErrorHandlingService = ErrorHandlingService;
      this.LoggingService = LoggingService;

      this.availableMonths = [];
      this.selectedMonth = null;
      this.summaryModel = null;
      this.breakdownModel = null;
      this.kpis = [];
      this.breakdownSeries = [];
      this.isLoading = false;
      this.errorMessage = null;
      this.breakdownMode = 'tiles';

      this.accountId = 'CC1234567890';

      this.init();
    }

    init() {
      var vm = this;
      vm.isLoading = true;
      vm.LoggingService.info('Initializing MonthlyDashboardController', { accountId: vm.accountId });

      vm.MonthlySummaryApiService.getAvailableMonths(vm.accountId)
        .then(function(months) {
          vm.availableMonths = months;
          vm.selectedMonth = vm.MonthSelectionService.getDefaultMonth(months);
          return vm.refreshSummary();
        })
        .catch(function(errorModel) {
          vm.errorMessage = vm.ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          vm.LoggingService.error('Failed to load available months', { errorModel: errorModel });
        });
    }

    onMonthChange(selectedMonth) {
      var vm = this;
      vm.selectedMonth = selectedMonth;
      vm.LoggingService.info('Month selection changed', { selectedMonth: selectedMonth });
      vm.refreshSummary();
    }

    refreshSummary() {
      var vm = this;
      vm.isLoading = true;
      vm.errorMessage = null;

      var normalized = vm.MonthSelectionService.normalizeMonthSelection(vm.selectedMonth);

      return vm.MonthlySummaryApiService.getMonthlySummary(vm.accountId, normalized)
        .then(function(result) {
          vm.summaryModel = result.summary;
          vm.breakdownModel = result.breakdown;
          vm.kpis = vm.KpiComputationService.buildKpis(vm.summaryModel);
          vm.breakdownSeries = vm.SpendBreakdownMapperService.toChartSeries(vm.breakdownModel);

          if (!vm.breakdownModel || !vm.breakdownModel.categories || vm.breakdownModel.categories.length === 0) {
            vm.LoggingService.info('No breakdown data for selected month', { month: vm.summaryModel ? vm.summaryModel.month : null });
          }

          vm.isLoading = false;
          vm.LoggingService.info('Monthly summary loaded', { month: vm.summaryModel ? vm.summaryModel.month : null });
        })
        .catch(function(errorModel) {
          vm.errorMessage = vm.ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          vm.LoggingService.error('Failed to load monthly summary', { errorModel: errorModel });
        });
    }

    navigateToInsights() {
      var vm = this;
      vm.LoggingService.info('Navigating to deeper insights entry point', {});
      window.location.hash = '#/dashboard/monthly-insights';
    }
  }

  MonthlyDashboardController.$inject = [
    'MonthlySummaryApiService',
    'MonthSelectionService',
    'KpiComputationService',
    'SpendBreakdownMapperService',
    'ErrorHandlingService',
    'LoggingService'
  ];

  angular.module('davms.spendDashboard')
    .controller('MonthlyDashboardController', MonthlyDashboardController);
})();
