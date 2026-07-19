(function () {
  'use strict';

  SpendingSummaryDashboardController.$inject = [
    'spendingSummaryService',
    'spendingTrendsService',
    'configService',
    'loggingService'
  ];

  function SpendingSummaryDashboardController(
    spendingSummaryService,
    spendingTrendsService,
    configService,
    loggingService
  ) {
    var vm = this;

    vm.selectedMonth = null;
    vm.monthOptions = [];
    vm.monthlySummary = null;
    vm.trendChartData = null;

    vm.summaryLoading = false;
    vm.trendLoading = false;

    vm.summaryError = null;
    vm.trendError = null;

    vm.initialize = initialize;
    vm.onMonthChange = onMonthChange;
    vm.retrySummary = retrySummary;
    vm.retryTrend = retryTrend;

    initialize();

    function initialize() {
      buildMonthOptions();
      if (vm.monthOptions.length > 0) {
        vm.selectedMonth = vm.monthOptions[0];
        loadSummary(vm.selectedMonth);
      }
      loadTrend();
    }

    function buildMonthOptions() {
      var today = new Date();
      var months = [];
      for (var i = 0; i < 6; i++) {
        var d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var monthStr = year + '-' + (month < 10 ? '0' + month : month);
        months.push(monthStr);
      }
      vm.monthOptions = months;
    }

    function onMonthChange() {
      if (!vm.selectedMonth) {
        return;
      }
      loadSummary(vm.selectedMonth);
    }

    function loadSummary(month) {
      vm.summaryLoading = true;
      vm.summaryError = null;

      spendingSummaryService.getMonthlySummary(month)
        .then(function (data) {
          vm.monthlySummary = data;
        })
        .catch(function (error) {
          vm.summaryError = error;
          vm.monthlySummary = null;
          loggingService.error('Failed to load monthly summary', { error: error, month: month });
        })
        .finally(function () {
          vm.summaryLoading = false;
        });
    }

    function loadTrend() {
      vm.trendLoading = true;
      vm.trendError = null;

      spendingTrendsService.getSixMonthTrends()
        .then(function (data) {
          vm.trendChartData = data;
        })
        .catch(function (error) {
          vm.trendError = error;
          vm.trendChartData = null;
          loggingService.error('Failed to load spending trends', { error: error });
        })
        .finally(function () {
          vm.trendLoading = false;
        });
    }

    function retrySummary() {
      if (vm.selectedMonth) {
        loadSummary(vm.selectedMonth);
      }
    }

    function retryTrend() {
      loadTrend();
    }
  }

  angular.module('app')
    .controller('SpendingSummaryDashboardController', SpendingSummaryDashboardController);
})();
