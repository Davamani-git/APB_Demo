(function () {
  "use strict";

  SpendingDashboardController.$inject = [
    "EnvService",
    "SpendingDashboardApiService",
    "SpendingDashboardMockService",
    "SpendingSummaryModel",
    "SpendingBreakdownModel",
    "KpiModel",
    "ErrorModel",
    "$log"
  ];

  function SpendingDashboardController(
    EnvService,
    SpendingDashboardApiService,
    SpendingDashboardMockService,
    SpendingSummaryModel,
    SpendingBreakdownModel,
    KpiModel,
    ErrorModel,
    $log
  ) {
    var vm = this;

    vm.availableMonths = [];
    vm.selectedMonth = "";
    vm.cardId = "CARD-1234"; // In real app, provided by authenticated context
    vm.summary = null;
    vm.breakdown = null;
    vm.kpis = [];
    vm.isLoading = false;
    vm.hasError = false;
    vm.error = null;

    vm.onMonthChange = onMonthChange;
    vm.retry = retry;

    initialize();

    function initialize() {
      buildAvailableMonths();
      if (vm.availableMonths.length > 0) {
        vm.selectedMonth = vm.availableMonths[0];
        loadDashboardData();
      }
    }

    function buildAvailableMonths() {
      var maxMonths = EnvService.getMaxLookbackMonths();
      var now = new Date();
      var months = [];

      for (var i = 0; i < maxMonths; i++) {
        var date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var monthStr = month < 10 ? "0" + month : month.toString();
        months.push(year + "-" + monthStr);
      }

      vm.availableMonths = months;
    }

    function onMonthChange() {
      loadDashboardData();
    }

    function retry() {
      loadDashboardData();
    }

    function loadDashboardData() {
      if (!vm.selectedMonth) {
        return;
      }

      vm.isLoading = true;
      vm.hasError = false;
      vm.error = null;

      var service = EnvService.isMockMode() ? SpendingDashboardMockService : SpendingDashboardApiService;

      var summaryPromise = service.getMonthlySummary(vm.cardId, vm.selectedMonth);
      var breakdownPromise = service.getMonthlyBreakdown(vm.cardId, vm.selectedMonth);

      summaryPromise
        .then(function (summaryData) {
          vm.summary = new SpendingSummaryModel(summaryData);
          vm.kpis = buildKpis(vm.summary);
        })
        .catch(function (error) {
          $log.error("Error loading summary", error);
          vm.hasError = true;
          vm.error = new ErrorModel(error);
        })
        .finally(function () {
          vm.isLoading = false;
        });

      breakdownPromise
        .then(function (breakdownData) {
          vm.breakdown = new SpendingBreakdownModel(breakdownData);
        })
        .catch(function (error) {
          $log.error("Error loading breakdown", error);
          if (!vm.hasError) {
            vm.hasError = true;
            vm.error = new ErrorModel(error);
          }
        });
    }

    function buildKpis(summary) {
      var kpis = [];
      var currencyUnit = summary.currency;

      var totalSpendKpi = new KpiModel(
        "Total Spend",
        summary.totalSpend,
        "glyphicon-stats",
        "currency",
        currencyUnit
      );

      var transactionCountKpi = new KpiModel(
        "Transactions",
        summary.transactionCount,
        "glyphicon-list-alt",
        "integer",
        "txns"
      );

      var averageSpendKpi = new KpiModel(
        "Average per Transaction",
        summary.averageTransactionAmount,
        "glyphicon-scale",
        "currency",
        currencyUnit
      );

      var maxTransactionKpi = new KpiModel(
        "Max Transaction",
        summary.maxTransactionAmount,
        "glyphicon-arrow-up",
        "currency",
        currencyUnit
      );

      kpis.push(totalSpendKpi);
      kpis.push(transactionCountKpi);
      kpis.push(averageSpendKpi);
      kpis.push(maxTransactionKpi);

      return kpis;
    }
  }

  angular.module("app")
    .controller("SpendingDashboardController", SpendingDashboardController);
})();
