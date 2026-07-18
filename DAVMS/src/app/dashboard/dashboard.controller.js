(function () {
  "use strict";

  DashboardController.$inject = [
    "dashboardService",
    "dashboardMapperService",
    "loggingService",
    "telemetryService"
  ];

  function DashboardController(
    dashboardService,
    dashboardMapperService,
    loggingService,
    telemetryService
  ) {
    const vm = this;

    vm.isLoading = false;
    vm.hasError = false;
    vm.error = null;
    vm.monthOptions = [];
    vm.selectedMonth = null;
    vm.accountId = "CC123456789"; // AccountId received from parent portal context in real integration
    vm.monthlySummary = null;
    vm.kpiCards = [];
    vm.breakdownChartData = { labels: [], data: [], colors: [] };

    vm.onMonthChange = onMonthChange;
    vm.retry = retry;

    activate();

    function activate() {
      vm.isLoading = true;
      vm.hasError = false;

      telemetryService.trackEvent("dashboard_activate", {});

      dashboardService.loadMonthOptions()
        .then(function (options) {
          vm.monthOptions = options;
          const current = options.find(function (opt) { return opt.isCurrent; });
          vm.selectedMonth = current ? current.value : (options.length > 0 ? options[0].value : null);
          if (vm.selectedMonth) {
            return loadSummary(vm.selectedMonth);
          }
          vm.isLoading = false;
          return null;
        })
        .catch(function (error) {
          vm.isLoading = false;
          vm.hasError = true;
          vm.error = error;
          loggingService.error("Failed to load month options", { error: error });
          telemetryService.trackError("load_month_options_failed", error, {});
        });
    }

    function loadSummary(month) {
      vm.isLoading = true;
      vm.hasError = false;

      dashboardService.loadMonthlySummary(vm.accountId, month)
        .then(function (summary) {
          vm.monthlySummary = summary;
          vm.kpiCards = dashboardMapperService.mapKpiCards(summary);
          vm.breakdownChartData = dashboardMapperService.mapBreakdownChartData(summary);
          vm.isLoading = false;
        })
        .catch(function (error) {
          vm.isLoading = false;
          vm.hasError = true;
          vm.error = error;
          loggingService.error("Failed to load monthly summary", { error: error });
          telemetryService.trackError("load_monthly_summary_failed", error, {});
        });
    }

    function onMonthChange() {
      if (vm.selectedMonth) {
        loadSummary(vm.selectedMonth);
      }
    }

    function retry() {
      if (vm.selectedMonth) {
        loadSummary(vm.selectedMonth);
      }
    }
  }

  angular
    .module("app.dashboard")
    .controller("DashboardController", DashboardController);
})();
