(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'app.dashboard', 'app.shared'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('HttpErrorInterceptor');
    }]);
  angular.module('app.shared', []);
})();