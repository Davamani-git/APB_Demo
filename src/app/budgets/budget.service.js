(function() {
  'use strict';
  angular.module('app.budgets')
    .service('BudgetService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      this.getBudgets = function() {
        return $http.get(API_CONFIG.baseUrl + '/budgets')
          .then(function(response) {
            return response.data;
          });
      };
      this.getBudget = function(budgetId) {
        return $http.get(API_CONFIG.baseUrl + '/budgets/' + budgetId)
          .then(function(response) {
            return response.data;
          });
      };
      this.createBudget = function(budgetData) {
        return $http.post(API_CONFIG.baseUrl + '/budgets', budgetData)
          .then(function(response) {
            return response.data;
          });
      };
      this.updateBudget = function(budgetId, budgetData) {
        return $http.put(API_CONFIG.baseUrl + '/budgets/' + budgetId, budgetData)
          .then(function(response) {
            return response.data;
          });
      };
      this.deleteBudget = function(budgetId) {
        return $http.delete(API_CONFIG.baseUrl + '/budgets/' + budgetId)
          .then(function(response) {
            return response.data;
          });
      };
      this.calculateProgress = function(budget) {
        if (!budget.limitAmount || budget.limitAmount === 0) return 0;
        return Math.min((budget.spentAmount / budget.limitAmount) * 100, 100);
      };
    }]);
})();