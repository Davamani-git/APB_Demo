(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardService', 'UserContextService', '$log'];
  function DashboardController(DashboardService, UserContextService, $log) {
    var vm = this;

    vm.summary = null;
    vm.cards = [];
    vm.isLoading = false;
    vm.error = null;
    vm.dateRange = { type: 'CURRENT_MONTH' };

    vm.init = init;
    vm.refreshDashboard = refreshDashboard;
    vm.onDateRangeChange = onDateRangeChange;

    init();

    function init() {
      refreshDashboard(vm.dateRange);
    }

    function refreshDashboard(range) {
      vm.isLoading = true;
      vm.error = null;

      var effectiveRange = range || { type: 'CURRENT_MONTH' };

      DashboardService
        .getDashboardOverview(effectiveRange)
        .then(function (data) {
          vm.summary = data.summary;
          vm.cards = data.cards;
        })
        .catch(function (err) {
          $log.error('Failed to load dashboard', err);
          vm.error = 'Unable to load dashboard at this time.';
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function onDateRangeChange(range) {
      vm.dateRange = range;
      refreshDashboard(range);
    }
  }
})();
