angular.module('davms.summary').controller('SummaryDashboardController', SummaryDashboardController);

SummaryDashboardController.$inject = ['SummaryApiService', 'SummaryKpiService', 'SummaryBreakdownService', 'LoggingService', 'ErrorHandlingService', 'MonthContextService', 'ConfigService'];
function SummaryDashboardController(SummaryApiService, SummaryKpiService, SummaryBreakdownService, LoggingService, ErrorHandlingService, MonthContextService, ConfigService) {
  const vm = this;

  vm.kpis = null;
  vm.breakdownItems = [];
  vm.error = null;
  vm.isLoading = false;
  vm.selectedMonth = MonthContextService.getSelectedMonth();
  vm.accountId = '1234567890'; // Mock account ID
  vm.featureFlags = {
    SHOW_BREAKDOWN_CHART: ConfigService.getFeatureFlag('SHOW_BREAKDOWN_CHART')
  };

  vm.init = init;
  vm.onMonthChanged = onMonthChanged;

  // Initialize on controller load
  init();

  function init() {
    loadSummary();
  }

  function onMonthChanged(monthKey) {
    MonthContextService.setSelectedMonth(monthKey);
    vm.selectedMonth = MonthContextService.getSelectedMonth();
    loadSummary();
  }

  function loadSummary() {
    vm.isLoading = true;
    vm.error = null;
    const monthKey = vm.selectedMonth.key;

    SummaryApiService.getMonthlySummary(vm.accountId, monthKey)
      .then(function(data) {
        vm.kpis = SummaryKpiService.computeKpis(data);
        vm.breakdownItems = SummaryBreakdownService.mapBreakdown(data);
      })
      .catch(function(mappedError) {
        vm.error = mappedError.userMessage;
        LoggingService.error('DASHBOARD_LOAD_FAILED', { mappedError: mappedError });
      })
      .finally(function() {
        vm.isLoading = false;
      });
  }
}