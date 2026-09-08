angular.module('transactionAnalyticsModule', ['ngRoute']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'src/app/modules/transaction-analytics/views/transaction-analytics.html',
      controller: 'TransactionAnalyticsController',
      controllerAs: 'vm'
    })
    .when('/analytics', {
      templateUrl: 'src/app/modules/transaction-analytics/views/transaction-analytics.html',
      controller: 'TransactionAnalyticsController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.hashPrefix('');
}]);