(function() {
  'use strict';
  angular.module('app', ['ngRoute', 'transactionAnalyticsModule'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/analytics', {
          templateUrl: 'src/app/modules/transaction-analytics/views/transaction-analytics.html',
          controller: 'TransactionAnalyticsController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/modules/transaction-analytics/views/transaction-list.html',
          controller: 'TransactionAnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/analytics'
        });
    }]);
})();