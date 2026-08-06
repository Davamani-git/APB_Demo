(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/card-management/card-management.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();