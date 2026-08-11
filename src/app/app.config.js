(function() {
  'use strict';
  angular.module('financeApp')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      timeout: 30000
    })
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $routeProvider
        .when('/accounts', {
          templateUrl: 'src/app/accounts/account-connection.view.html',
          controller: 'AccountConnectionController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/transactions/transaction.view.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .when('/budgets', {
          templateUrl: 'src/app/budgets/budget.view.html',
          controller: 'BudgetController',
          controllerAs: 'vm'
        })
        .when('/goals', {
          templateUrl: 'src/app/goals/goal.view.html',
          controller: 'GoalController',
          controllerAs: 'vm'
        })
        .when('/insights', {
          templateUrl: 'src/app/insights/insights.view.html',
          controller: 'InsightsController',
          controllerAs: 'vm'
        })
        .when('/nlquery', {
          templateUrl: 'src/app/nlquery/nlquery.view.html',
          controller: 'NLQueryController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/accounts'
        });
    }])
    .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
      $rootScope.logout = function() {
        AuthService.logout();
      };
    }]);
})();