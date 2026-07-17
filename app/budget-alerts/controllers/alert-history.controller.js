'use strict';

(function () {
  function AlertHistoryController(BudgetAlertApiService, AlertModelService, $log) {
    'ngInject';
    var vm = this;

    vm.alerts = [];
    vm.loading = false;
    vm.error = null;
    vm.filters = {
      page: 0,
      size: 20
    };

    vm.init = function () {
      vm.loading = true;
      vm.error = null;
      var params = {
        page: vm.filters.page,
        size: vm.filters.size
      };
      BudgetAlertApiService.getAlerts(params)
        .then(function (data) {
          AlertModelService.setAlerts(data.alerts || []);
          vm.alerts = AlertModelService.getAlerts();
        })
        .catch(function (err) {
          vm.error = 'Unable to load alert history.';
          $log.error('Error loading alerts', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.applyFilter = function (filter) {
      angular.extend(vm.filters, filter);
      vm.init();
    };

    vm.init();
  }

  angular
    .module('davBanking.budgetAlerts')
    .controller('AlertHistoryController', AlertHistoryController);
})();
