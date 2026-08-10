(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          resolve: {
            auth: ['rbacService', function(rbacService) {
              return rbacService.checkPermission('view:dashboard');
            }]
          }
        })
        .when('/data-integration', {
          templateUrl: 'src/app/data-integration/data-connection.view.html',
          controller: 'DataConnectionController',
          controllerAs: 'vm',
          resolve: {
            auth: ['rbacService', function(rbacService) {
              return rbacService.checkPermission('manage:integrations');
            }]
          }
        })
        .when('/login', {
          templateUrl: 'src/app/security/login.view.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('authInterceptor');
      $locationProvider.hashPrefix('');
    }])
    .run(['$rootScope', '$location', 'authService', 'alertService', 'freshnessMonitorService', function($rootScope, $location, authService, alertService, freshnessMonitorService) {
      $rootScope.$on('$routeChangeStart', function(event, next) {
        if (!authService.isAuthenticated() && next.$$route && next.$$route.originalPath !== '/login') {
          event.preventDefault();
          $location.path('/login');
        }
      });
      alertService.startMonitoring();
      freshnessMonitorService.startMonitoring();
    }]);
})();