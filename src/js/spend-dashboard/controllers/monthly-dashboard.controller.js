(function() {
  'use strict';

  function MonthlyDashboardController(MonthlySummaryApiService,
                                      MonthSelectionService,
                                      KpiComputationService,
                                      SpendBreakdownMapperService,
                                      ErrorHandlingService,
                                      LoggingService) {
    var vm = this;

    vm.availableMonths = [];
    vm.selectedMonth = null;
    vm.summaryModel = null;
    vm.breakdownModel = null;
    vm.kpis = [];
    vm.breakdownSeries = [];
    vm.breakdownMode = 'chart';
    vm.isLoading = false;
    vm.errorMessage = null;
    vm.accountId = 'CC1234567890';

    vm.init = init;
    vm.onMonthChange = onMonthChange;
    vm.refreshSummary = refreshSummary;
    vm.navigateToInsights = navigateToInsights;

    init();

    function init() {
      vm.isLoading = true;
      vm.errorMessage = null;

      MonthlySummaryApiService.getAvailableMonths(vm.accountId)
        .then(function(monthsResponse) {
          vm.availableMonths = monthsResponse.months || [];

          if (vm.availableMonths.length === 0) {
            vm.selectedMonth = MonthSelectionService.getDefaultMonth();
          } else {
            vm.selectedMonth = MonthSelectionService.getDefaultMonth(vm.availableMonths);
          }

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
      if (!MonthSelectionService.isMonthSelectable(selectedMonth, vm.availableMonths)) {
        vm.errorMessage = 'Data is not available for the selected period.';
        return;
      }
      vm.selectedMonth = selectedMonth;
      refreshSummary();
    }

    function refreshSummary() {
      vm.isLoading = true;
      vm.errorMessage = null;

      var monthContext = MonthSelectionService.normalizeMonthSelection(vm.selectedMonth);

      MonthlySummaryApiService.getMonthlySummary(vm.accountId, monthContext)
        .then(function(result) {
          vm.summaryModel = result.summary;
          vm.breakdownModel = result.breakdown;

          vm.kpis = KpiComputationService.buildKpis(vm.summaryModel);
          vm.breakdownSeries = SpendBreakdownMapperService.toChartSeries(vm.breakdownModel);

          if (!vm.breakdownModel || vm.breakdownModel.categories.length === 0) {
            vm.errorMessage = 'A meaningful breakdown is not available for the selected month.';
          }

          vm.isLoading = false;
        })
        .catch(function(err) {
          var errorModel = ErrorHandlingService.classifyHttpError(err);
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          LoggingService.error('Failed to load monthly summary', { error: err });
        });
    }

    function navigateToInsights() {
      LoggingService.info('Navigate to deeper insights triggered from breakdown.', {
        accountId: vm.accountId,
        selectedMonth: vm.selectedMonth
      });
      // Navigation would be handled by a higher-level router in the real application.
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
