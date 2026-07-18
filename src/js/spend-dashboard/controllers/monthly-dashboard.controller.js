(function() {
  'use strict';

  class MonthlyDashboardController {
    constructor(MonthlySummaryApiService, MonthSelectionService, KpiComputationService,
                SpendBreakdownMapperService, ErrorHandlingService, LoggingService) {
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
      this.breakdownMode = 'chart';
    }

    init(accountId) {
      var self = this;
      self.isLoading = true;
      self.errorMessage = null;

      self.MonthlySummaryApiService.getAvailableMonths(accountId)
        .then(function(months) {
          self.availableMonths = months;
          self.selectedMonth = self.MonthSelectionService.getDefaultMonth(months);
          return self.refreshSummary(accountId);
        })
        .catch(function(errorModel) {
          self.errorMessage = self.ErrorHandlingService.toUserMessage(errorModel);
          self.isLoading = false;
          self.LoggingService.error('Failed to load available months', { error: errorModel });
        });
    }

    onMonthChange(selectedMonth) {
      var self = this;
      self.selectedMonth = selectedMonth;
      self.errorMessage = null;
      self.isLoading = true;

      var accountId = self.summaryModel ? self.summaryModel.accountId : null;
      self.refreshSummary(accountId);
    }

    refreshSummary(accountId) {
      var self = this;
      if (!accountId) {
        // If accountId is not known from summary, the controller assumes
        // a single-card context provided externally. For this epic, we keep
        // the method signature and call pattern as defined in the LLD.
        accountId = 'CC_DEFAULT_ACCOUNT';
      }

      var context = self.MonthSelectionService.normalizeMonthSelection(self.selectedMonth);

      return self.MonthlySummaryApiService.getMonthlySummary(accountId, context)
        .then(function(result) {
          self.summaryModel = result.summary;
          self.breakdownModel = result.breakdown;

          self.kpis = self.KpiComputationService.buildKpis(self.summaryModel);
          self.breakdownSeries = self.SpendBreakdownMapperService.toChartSeries(self.breakdownModel);

          if (!self.breakdownSeries || !self.breakdownSeries.length) {
            self.errorMessage = null;
          } else {
            self.errorMessage = null;
          }
          self.isLoading = false;
        })
        .catch(function(errorModel) {
          self.errorMessage = self.ErrorHandlingService.toUserMessage(errorModel);
          self.isLoading = false;
          self.LoggingService.error('Failed to load monthly summary', { error: errorModel });
        });
    }

    navigateToInsights() {
      // Navigation to deeper insights is assumed to be handled via
      // external routing; this method exists per LLD to act as an
      // entry point from the basic breakdown view.
      this.LoggingService.info('Navigate to deeper insights requested', {
        month: this.selectedMonth
      });
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
