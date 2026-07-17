(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .controller('MonthlyDashboardController', MonthlyDashboardController);

  MonthlyDashboardController.$inject = ['$q', 'SpendSummaryService', 'ProfileService', 'ConfigService', 'LoggerService', 'ErrorModel'];

  function MonthlyDashboardController($q, SpendSummaryService, ProfileService, ConfigService, LoggerService, ErrorModel) {
    var vm = this;

    vm.selectedMonth = null;
    vm.summary = null;
    vm.isLoading = false;
    vm.error = null;
    vm.showStaleWarning = false;
    vm.breakdownEnabled = true;

    vm.monthOptions = [];

    vm.init = init;
    vm.onMonthChange = onMonthChange;
    vm.refresh = refresh;

    activate();

    function activate() {
      vm.isLoading = true;
      vm.error = null;

      var configPromise = ConfigService.load();
      var profilePromise = ProfileService.getProfile();

      $q.all([configPromise, profilePromise])
        .then(function (results) {
          vm.breakdownEnabled = ConfigService.isBreakdownEnabled();
          var profile = results[1] || {};
          var defaultMonth = deriveDefaultMonth(profile);
          vm.selectedMonth = defaultMonth;
          buildMonthOptions(defaultMonth, ConfigService.getMaxLookbackMonths());
          return loadSummary(vm.selectedMonth);
        })
        .catch(function (error) {
          LoggerService.error('Initialization failed', { error: error });
          vm.error = new ErrorModel('INIT_FAILED', 'Unable to initialize the dashboard. Please try again later.');
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function deriveDefaultMonth(profile) {
      if (profile && profile.dashboardPreferences && profile.dashboardPreferences.defaultMonthMode === 'LATEST') {
        return ProfileService.getPreferredDefaultMonth();
      }
      return ProfileService.getPreferredDefaultMonth();
    }

    function buildMonthOptions(latestMonth, maxLookback) {
      vm.monthOptions = [];
      if (!latestMonth || !maxLookback) {
        return;
      }
      var parts = latestMonth.split('-');
      var year = parseInt(parts[0], 10);
      var monthIndex = parseInt(parts[1], 10) - 1;
      var current = new Date(year, monthIndex, 1);
      for (var i = 0; i < maxLookback; i++) {
        var y = current.getFullYear();
        var m = current.getMonth() + 1;
        var ms = m < 10 ? '0' + m : '' + m;
        vm.monthOptions.push(y + '-' + ms);
        current.setMonth(current.getMonth() - 1);
      }
    }

    function onMonthChange() {
      if (!vm.selectedMonth) {
        return;
      }
      LoggerService.info('Month selection changed', { month: vm.selectedMonth });
      vm.isLoading = true;
      vm.error = null;
      loadSummary(vm.selectedMonth)
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function refresh() {
      if (!vm.selectedMonth) {
        return;
      }
      LoggerService.info('Dashboard refresh requested', { month: vm.selectedMonth });
      vm.isLoading = true;
      vm.error = null;
      loadSummary(vm.selectedMonth)
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function loadSummary(month) {
      return SpendSummaryService.getMonthlySummary(month)
        .then(function (summary) {
          vm.summary = summary;
          var threshold = ConfigService.getFreshnessThresholdMinutes();
          vm.showStaleWarning = !!(summary && summary.isStale(threshold));
        })
        .catch(function (error) {
          if (error && error.code) {
            vm.error = error;
          } else {
            vm.error = new ErrorModel('SERVER_ERROR', 'An error occurred while loading your monthly summary.');
          }
        });
    }

    function init() {
      activate();
    }
  }
})();
