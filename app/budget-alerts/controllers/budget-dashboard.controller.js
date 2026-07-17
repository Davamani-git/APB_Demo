'use strict';

(function () {
  function BudgetDashboardController(BudgetAlertApiService, BudgetModelService, AuditEventService, $location, $log) {
    'ngInject';
    var vm = this;

    vm.budgets = [];
    vm.loading = false;
    vm.error = null;

    vm.init = function () {
      vm.loading = true;
      BudgetAlertApiService.getBudgets()
        .then(function (data) {
          BudgetModelService.setBudgets(data.budgets || []);
          vm.budgets = BudgetModelService.getBudgets();
          AuditEventService.logEvent('BUDGET_DASHBOARD_VIEW', { count: vm.budgets.length });
        })
        .catch(function (err) {
          vm.error = 'Unable to load budgets.';
          $log.error('Error loading budgets', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.refresh = function () {
      vm.init();
    };

    vm.createBudget = function () {
      $location.path('/budgets/new');
    };

    vm.editBudget = function (budget) {
      if (!budget || !budget.id) { return; }
      $location.path('/budgets/' + encodeURIComponent(budget.id));
    };

    vm.init();
  }

  angular
    .module('davBanking.budgetAlerts')
    .controller('BudgetDashboardController', BudgetDashboardController);
})();
