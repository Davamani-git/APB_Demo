(function() {
  'use strict';
  angular.module('fraudDetectionApp', ['ngRoute'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $httpProvider.interceptors.push('HttpInterceptorService');
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/fraud-detection/views/dashboard.html',
          controller: 'FraudDashboardController',
          controllerAs: 'vm'
        })
        .when('/monitor', {
          templateUrl: 'src/app/modules/fraud-detection/views/transaction-monitor.html',
          controller: 'TransactionMonitorController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
    }]);
})();