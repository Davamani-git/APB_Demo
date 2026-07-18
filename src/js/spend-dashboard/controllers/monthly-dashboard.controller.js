(function() {
  'use strict';

  function MonthlyDashboardController(
    MonthlySummaryApiService,
    MonthSelectionService,
    KpiComputationService,
    SpendBreakdownMapperService,
    ErrorHandlingService,
    LoggingService
  ) {
    var vm = this;
    
    // Initialize properties
    vm.availableMonths = [];
    vm.selectedMonth = null;
    vm.summaryModel = null;
    vm.breakdownModel = null;
    vm.kpis = [];
    vm.breakdownSeries = null;
    vm.breakdownTiles = [];
    vm.isLoading = false;
    vm.errorMessage = null;
    vm.accountId = 'CC1234567890'; // In real app, this would come from auth context
    vm.chartMode = 'tiles'; // Default to tiles view
    
    // Public methods
    vm.init = init;
    vm.onMonthChange = onMonthChange;
    vm.refreshSummary = refreshSummary;
    vm.toggleChartMode = toggleChartMode;
    
    // Initialize on controller load
    init();
    
    function init() {
      vm.isLoading = true;
      vm.errorMessage = null;
      
      LoggingService.info('Initializing monthly dashboard', { accountId: vm.accountId });
      
      MonthlySummaryApiService.getAvailableMonths(vm.accountId)
        .then(function(months) {
          vm.availableMonths = months;
          vm.selectedMonth = MonthSelectionService.getDefaultMonth(months);
          return refreshSummary();
        })
        .catch(function(errorModel) {
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          LoggingService.error('Failed to load available months', { 
            accountId: vm.accountId,
            error: errorModel
          });
        });
    }
    
    function onMonthChange(selectedMonth) {
      LoggingService.info('Month selection changed', { 
        newMonth: selectedMonth,
        accountId: vm.accountId
      });
      
      vm.selectedMonth = selectedMonth;
      refreshSummary();
    }
    
    function refreshSummary() {
      if (!vm.selectedMonth) {
        return;
      }
      
      vm.isLoading = true;
      vm.errorMessage = null;
      
      var context = MonthSelectionService.normalizeMonthSelection(vm.selectedMonth);
      
      LoggingService.info('Refreshing summary data', {
        accountId: vm.accountId,
        monthContext: context
      });
      
      return MonthlySummaryApiService.getMonthlySummary(vm.accountId, context)
        .then(function(result) {
          vm.summaryModel = result.summary;
          vm.breakdownModel = result.breakdown;
          
          // Update KPIs
          vm.kpis = KpiComputationService.buildKpis(vm.summaryModel);
          
          // Update breakdown visualizations
          vm.breakdownSeries = SpendBreakdownMapperService.toChartSeries(vm.breakdownModel);
          vm.breakdownTiles = SpendBreakdownMapperService.toTiles(vm.breakdownModel);
          
          vm.errorMessage = null;
          vm.isLoading = false;
          
          LoggingService.info('Summary data loaded successfully', {
            accountId: vm.accountId,
            totalSpend: vm.summaryModel.totalSpend,
            transactionCount: vm.summaryModel.transactionCount,
            categoriesCount: vm.breakdownModel.categories.length
          });
        })
        .catch(function(errorModel) {
          vm.errorMessage = ErrorHandlingService.toUserMessage(errorModel);
          vm.isLoading = false;
          
          LoggingService.error('Failed to load monthly summary', {
            accountId: vm.accountId,
            monthContext: context,
            error: errorModel
          });
        });
    }
    
    function toggleChartMode() {
      vm.chartMode = vm.chartMode === 'chart' ? 'tiles' : 'chart';
      LoggingService.info('Chart mode toggled', { newMode: vm.chartMode });
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