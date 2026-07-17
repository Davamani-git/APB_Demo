'use strict';

(function () {
  function BudgetEditController(BudgetAlertApiService, BudgetModelService, $routeParams, $location, $log) {
    'ngInject';
    var vm = this;

    vm.model = {
      name: '',
      category: '',
      accountId: '',
      limitAmount: null,
      currency: 'USD',
      period: 'MONTHLY',
      alertEnabled: true
    };
    vm.loading = false;
    vm.error = null;
    vm.isEdit = !!$routeParams.id;

    vm.init = function () {
      if (vm.isEdit) {
        vm.loading = true;
        BudgetAlertApiService.getBudget($routeParams.id)
          .then(function (data) {
            vm.model = data;
          })
          .catch(function (err) {
            vm.error = 'Unable to load budget.';
            $log.error('Error loading budget', err);
          })
          .finally(function () {
            vm.loading = false;
          });
      }
    };

    vm.save = function (form) {
      vm.error = null;
      if (form && form.$invalid) {
        vm.error = 'Please correct validation errors.';
        return;
      }
      if (!vm.model.limitAmount || vm.model.limitAmount <= 0) {
        vm.error = 'Limit amount must be greater than zero.';
        return;
      }
      var action = vm.isEdit ? BudgetAlertApiService.updateBudget($routeParams.id, vm.model)
                             : BudgetAlertApiService.createBudget(vm.model);
      action.then(function () {
        $location.path('/budgets');
      }).catch(function (err) {
        vm.error = 'Failed to save budget.';
        $log.error('Error saving budget', err);
      });
    };

    vm.cancel = function () {
      $location.path('/budgets');
    };

    vm.init();
  }

  angular
    .module('davBanking.budgetAlerts')
    .controller('BudgetEditController', BudgetEditController);
})();
