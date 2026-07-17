(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .controller('MonthlyDashboardController', MonthlyDashboardController);

  MonthlyDashboardController.$inject = ['$q', '$timeout', 'SpendSummaryService', 'ProfileService', 'ConfigService', 'LoggerService', 'ErrorModel'];

  function MonthlyDashboardController($q, $timeout, SpendSummaryService, ProfileService, ConfigService, LoggerService, ErrorModel) {
    var vm = this;

    vm.selectedMonth = null;
    vm.summary = null;
    vm.isLoading = false;
    vm.error = null;
    vm.showStaleWarning = false;
    vm.hasMonthlySummaryAvailable = true;

    vm.monthOptions = [];
    vm.onMonthChange = onMonthChange;
    vm.refresh = refresh;

    vm.init = init;

    init();

    function init() {
      vm.isLoading = true;
      vm.error = null;

      var loadConfigPromise = ConfigService.load();
      var profilePromise = ProfileService.getPreferredDefaultMonth();

      $q.all([loadConfigPromise, profilePromise])
        .then(function (results) {
          var defaultMonth = results[1];
          buildMonthOptions(defaultMonth);
          vm.selectedMonth = defaultMonth;
          return loadSummaryForSelectedMonth();
        })
        .catch(function (err) {
          LoggerService.error('Failed to initialize dashboard', { error: err });
          vm.error = new ErrorModel('INIT_FAILED', 'Unable to initialize dashboard. Please try again later.');
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function buildMonthOptions(defaultMonth) {
      vm.monthOptions = [];
      var maxLookback = ConfigService.getMaxLookbackMonths();
      var now = new Date();
      var currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      for (var i = 0; i <= maxLookback; i++) {
        var d = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - i, 1);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var monthStr = (month < 10 ? '0' + month : '' + month);
        var value = year + '-' + monthStr;
        vm.monthOptions.push({
          value: value,
          label: formatMonthLabel(d)
        });
      }
    }

    function formatMonthLabel(date) {
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return monthNames[date.getMonth()] + ' ' + date.getFullYear();
    }

    function onMonthChange() {
      vm.error = null;
      vm.hasMonthlySummaryAvailable = true;
      loadSummaryForSelectedMonth();
    }

    function refresh() {
      vm.error = null;
      loadSummaryForSelectedMonth();
    }

    function loadSummaryForSelectedMonth() {
      if (!vm.selectedMonth) {
        return $q.when();
      }
      vm.isLoading = true;
      vm.error = null;

      LoggerService.info('Loading monthly summary', { month: vm.selectedMonth });

      return SpendSummaryService.getMonthlySummary(vm.selectedMonth)
        .then(function (summary) {
          vm.summary = summary;
          vm.hasMonthlySummaryAvailable = summary && (summary.transactionCount > 0 || summary.totalSpend > 0 || (summary.breakdown && summary.breakdown.length > 0));
          vm.showStaleWarning = !!summary && summary.isStale(ConfigService.getFreshnessThresholdMinutes());
        })
        .catch(function (err) {
          vm.summary = null;
          vm.hasMonthlySummaryAvailable = false;
          vm.error = err instanceof ErrorModel ? err : new ErrorModel(err.code, err.message, err.httpStatus, err.details);
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }
  }
})();
