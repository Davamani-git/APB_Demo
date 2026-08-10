(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/transactions', {
        templateUrl: 'src/app/transactions/views/transaction-list.html',
        controller: 'TransactionController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/transactions'
      });
    $locationProvider.hashPrefix('');
  }]);
})();