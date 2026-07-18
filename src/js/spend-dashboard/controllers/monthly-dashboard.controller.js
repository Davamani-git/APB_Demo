(function() {
  'use strict';

  class MonthlyDashboardController {
    constructor(MonthlySummaryApiService,
                MonthSelectionService,
                KpiComputationService,
                SpendBreakdownMapperService,
                ErrorHandlingService,
                LoggingService,
                $location) {
      this.MonthlySummaryApiService = MonthlySummaryApiService;
      this.MonthSelectionService = MonthSelectionService;
      this.KpiComputationService = KpiComputationService;
      this.SpendBreakdownMapperService = SpendBreakdownMapperService;
      this.ErrorHandlingService = ErrorHandlingService;
      this.LoggingService = LoggingService;
      this.$location = $location;

      this.availableMonths = [];
      this.selectedMonth = null;
      this.summaryModel = null;
      this.breakdownModel = null;
      this.kpis = [];
      this.breakdownSeries = null;
      this.breakdownTiles = [];
      this.isLoading = false;
      this.errorMessage = null;
      this.accountId = null; // In a real app, this would come from authenticated context.

      this.init();
    }

    init() {
      // For demo purposes, assume a single active credit card account.
      this.accountId = 'CC-DEMO-ACCOUNT';
      this.isLoading = true;

      var self = this;
      this.MonthlySummaryApiService.getAvailableMonths(this.accountId)
        .then(function(months) {
          self.availableMonths = months;
          self.selectedMonth = self.MonthSelectionService.getDefaultMonth(months);
          return self.refreshSummary();
        })
        .catch(function(errorModel) {
          self.errorMessage = self.ErrorHandlingService.toUserMessage(errorModel);
          self.isLoading = false;
          self.LoggingService.error('Failed to load available months', { errorModel: errorModel });
        });
    }

    onMonthChange(selectedMonth) {
      if (!selectedMonth) {
        return;
      }
      this.selectedMonth = selectedMonth;
      this.refreshSummary();
    }

    refreshSummary() {
      var self = this;
      self.isLoading = true;
      self.errorMessage = null;

      var context = self.MonthSelectionService.normalizeMonthSelection(self.selectedMonth);

      return self.MonthlySummaryApiService.getMonthlySummary(self.accountId, context)
        .then(function(result) {
          self.summaryModel = result.summary;
          self.breakdownModel = result.breakdown;
          self.kpis = self.KpiComputationService.buildKpis(self.summaryModel);

          if (self.breakdownModel && self.breakdownModel.hasData()) {
            self.breakdownSeries = self.SpendBreakdownMapperService.toChartSeries(self.breakdownModel);
            self.breakdownTiles = self.SpendBreakdownMapperService.toTiles(self.breakdownModel);
          } else {
            self.breakdownSeries = null;
            self.breakdownTiles = [];
          }

          // Handle insufficient data case
          if (!self.summaryModel.hasActivity()) {
            self.errorMessage = 'There is no spending activity for the selected month.';
          }

          self.isLoading = false;
        })
        .catch(function(errorModel) {
          self.errorMessage = self.ErrorHandlingService.toUserMessage(errorModel);
          self.isLoading = false;
          self.LoggingService.error('Failed to load monthly summary', { errorModel: errorModel });
        });
    }

    handleCategoryClick(category) {
      // Navigate to deeper insights without exposing transaction-level detail.
      // For the purpose of this epic, we just change location to a placeholder route.
      this.LoggingService.info('Navigating to detailed insights for category', { categoryCode: category.code });
      this.$location.path('/dashboard/monthly-insights').search({ categoryCode: category.code });
    }
  }

  MonthlyDashboardController.$inject = [
    'MonthlySummaryApiService',
    'MonthSelectionService',
    'KpiComputationService',
    'SpendBreakdownMapperService',
    'ErrorHandlingService',
    'LoggingService',
    '$location'
  ];

  angular.module('davms.spendDashboard')
    .controller('MonthlyDashboardController', MonthlyDashboardController);
})();
