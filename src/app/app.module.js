(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'creditCardDashboard', 'transactionManagement'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/modules/transactions/transactions.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }])
    .run(['$http', 'AuthService', function($http, AuthService) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + AuthService.getToken();
    }]);
})();