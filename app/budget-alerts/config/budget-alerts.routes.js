'use strict';

(function () {
  function requireAuth(SecurityContextService, $q, $location) {
    'ngInject';
    if (SecurityContextService.isAuthenticated()) {
      return $q.resolve();
    }
    $location.path('/login');
    return $q.reject('NOT_AUTHENTICATED');
  }

  angular
    .module('davBanking.budgetAlerts')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/budgets', {
          templateUrl: 'app/budget-alerts/views/budget-dashboard.html',
          controller: 'BudgetDashboardController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/budgets/new', {
          templateUrl: 'app/budget-alerts/views/budget-edit.html',
          controller: 'BudgetEditController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/budgets/:id', {
          templateUrl: 'app/budget-alerts/views/budget-edit.html',
          controller: 'BudgetEditController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/alerts', {
          templateUrl: 'app/budget-alerts/views/alert-history.html',
          controller: 'AlertHistoryController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        });
    }]);
})();
