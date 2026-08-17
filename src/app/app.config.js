(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_ENDPOINT', '/api')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/modules/transactions/views/transaction-list.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }])
    .run(['$http', function($http) {
      $http.interceptors.push(['$q', function($q) {
        return {
          responseError: function(rejection) {
            console.error('API Error:', rejection.status, rejection.statusText);
            return $q.reject(rejection);
          }
        };
      }]);
    }]);
})();