(function () {
  "use strict";

  DashboardController.$inject = ["$q", "$routeParams", "SpendSummaryService", "KpiSummaryModel", "SpendSummaryModel", "SpendBreakdownModel", "LoggingService"];

  function DashboardController($q, $routeParams, SpendSummaryService, KpiSummaryModel, SpendSummaryModel, SpendBreakdownModel, LoggingService) {
    var vm = this;

    vm.summary = null;
    vm.kpis = null;
    vm.breakdown = null;
    vm.error = null;
    vm.loading = false;
    vm.selectedMonth = null;

    vm.onMonthChange = function (month) {
      vm.selectedMonth = month;
      vm.reload();
    };

    vm.reload = function () {
      if (!vm.selectedMonth) {
        vm.selectedMonth = SpendSummaryService.getDefaultMonth();
      }
      loadData(vm.selectedMonth);
    };

    vm.hasData = function () {
      return !!(vm.summary && vm.kpis && vm.breakdown);
    };

    vm.isLoading = function () {
      return vm.loading;
    };

    vm.hasError = function () {
      return !!vm.error;
    };

    function init() {
      var routeMonth = $routeParams.month;
      vm.selectedMonth = routeMonth || SpendSummaryService.getDefaultMonth();
      loadData(vm.selectedMonth);
    }

    function loadData(month) {
      vm.loading = true;
      vm.error = null;

      LoggingService.info("Loading dashboard data", { month: month });

      SpendSummaryService.getMonthlySummary(month)
        .then(function (result) {
          vm.summary = result.summary;
          vm.kpis = result.kpis;
          vm.breakdown = result.breakdown;
          LoggingService.info("Dashboard data loaded", { month: month });
        })
        .catch(function (error) {
          vm.error = error;
          LoggingService.error("Failed to load dashboard data", { error: error });
        })
        .finally(function () {
          vm.loading = false;
        });
    }

    init();
  }

  angular
    .module("app")
    .controller("DashboardController", DashboardController);
}());
