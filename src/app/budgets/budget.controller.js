(function() {
  'use strict';
  angular.module('app.budgets')
    .controller('BudgetController', ['$scope', '$filter', 'BudgetService', 'CategoryService', function($scope, $filter, BudgetService, CategoryService) {
      var vm = this;
      vm.budgets = [];
      vm.categories = [];
      vm.newBudget = {};
      vm.loading = false;
      vm.error = null;
      vm.showCreateForm = false;
      vm.createBudget = createBudget;
      vm.updateBudget = updateBudget;
      vm.deleteBudget = deleteBudget;
      vm.toggleCreateForm = toggleCreateForm;
      vm.cancelCreate = cancelCreate;
      init();
      function init() {
        loadCategories();
        loadBudgets();
      }
      function loadCategories() {
        CategoryService.getCategories()
          .then(function(categories) {
            vm.categories = categories;
          });
      }
      function loadBudgets() {
        vm.loading = true;
        BudgetService.getBudgets()
          .then(function(budgets) {
            vm.budgets = budgets.map(function(budget) {
              budget.progress = BudgetService.calculateProgress(budget);
              return budget;
            });
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load budgets';
            vm.loading = false;
          });
      }
      function createBudget() {
        if (!vm.newBudget.categoryId || !vm.newBudget.limitAmount) {
          vm.error = 'Please fill all required fields';
          return;
        }
        var budgetData = {
          categoryId: vm.newBudget.categoryId,
          limitAmount: vm.newBudget.limitAmount,
          period: vm.newBudget.period || 'monthly',
          alertThresholds: vm.newBudget.alertThresholds || [50, 80, 100]
        };
        BudgetService.createBudget(budgetData)
          .then(function() {
            vm.newBudget = {};
            vm.showCreateForm = false;
            loadBudgets();
          })
          .catch(function(error) {
            vm.error = 'Failed to create budget';
          });
      }
      function updateBudget(budget) {
        BudgetService.updateBudget(budget.id, budget)
          .then(function() {
            loadBudgets();
          })
          .catch(function(error) {
            vm.error = 'Failed to update budget';
          });
      }
      function deleteBudget(budgetId) {
        if (!confirm('Are you sure you want to delete this budget?')) {
          return;
        }
        BudgetService.deleteBudget(budgetId)
          .then(function() {
            loadBudgets();
          })
          .catch(function(error) {
            vm.error = 'Failed to delete budget';
          });
      }
      function toggleCreateForm() {
        vm.showCreateForm = !vm.showCreateForm;
        if (vm.showCreateForm) {
          vm.newBudget = {
            alertThresholds: [50, 80, 100],
            period: 'monthly'
          };
        }
      }
      function cancelCreate() {
        vm.showCreateForm = false;
        vm.newBudget = {};
      }
    }]);
})();