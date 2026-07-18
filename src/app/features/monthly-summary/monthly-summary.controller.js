(function () {
  'use strict';

  MonthlySummaryController.$inject = ['SummaryApiService', 'MonthSelectionService', 'ConfigService', 'LoggingService', 'TelemetryService', 'ErrorMappingService', '$q'];

  function MonthlySummaryController(SummaryApiService, MonthSelectionService, ConfigService, LoggingService, TelemetryService, ErrorMappingService, $q) {
    var vm = this;

    vm.accountId = 'CC-1234567890'; // For this epic, a placeholder credit card account.
    vm.availableMonths = [];
    vm.selectedMonth = null;
    vm.summary = null;
    vm.breakdown = null;
    vm.isLoading = false;
    vm.error = null;

    vm.onMonthChange = onMonthChange;
    vm.reload = reload;
    vm.hasSummary = hasSummary;

    initialize();

    function initialize() {
      vm.availableMonths = MonthSelectionService.getAvailableMonths();
      vm.selectedMonth = vm.availableMonths[0] || null;
      if (vm.selectedMonth) {
        loadSummary();
      }
    }

    function onMonthChange() {
      loadSummary();
    }

    function reload() {
      loadSummary();
    }

    function hasSummary() {
      return !!vm.summary;
    }

    function loadSummary() {
      if (!vm.selectedMonth) {
        return;
      }
      vm.isLoading = true;
      vm.error = null;
      vm.summary = null;
      vm.breakdown = null;

      SummaryApiService.getMonthlySummary(vm.accountId, vm.selectedMonth)
        .then(function (result) {
          vm.summary = result.summary;
          vm.breakdown = result.breakdown;
          vm.isLoading = false;
          TelemetryService.trackEvent('summary_loaded', {
            accountId: vm.accountId,
            month: vm.selectedMonth
          });
        })
        .catch(function (err) {
          vm.isLoading = false;
          var errorModel;
          if (err && err.code) {
            errorModel = err;
          } else {
            errorModel = ErrorMappingService.mapHttpError({ status: err && err.status });
          }
          vm.error = errorModel;
          LoggingService.error('Failed to load monthly summary', errorModel);
          TelemetryService.trackEvent('summary_load_failed', {
            accountId: vm.accountId,
            month: vm.selectedMonth,
            errorCode: errorModel.code
          });
        });
    }
  }

  angular.module('davmsApp')
    .controller('MonthlySummaryController', MonthlySummaryController);
})();
