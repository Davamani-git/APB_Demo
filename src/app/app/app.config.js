(function () {
  'use strict';

  angular
    .module('ccdDashboardApp')
    .config([
      '$routeProvider',
      '$httpProvider',
      function ($routeProvider, $httpProvider) {
        configureRoutes($routeProvider);
        configureHttp($httpProvider);
      }
    ]);

  function configureRoutes($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/app/dashboard/views/dashboard-summary.view.html',
        controller: 'DashboardSummaryController',
        controllerAs: 'vm',
        resolve: {
          authGuard: [
            'authTokenService',
            '$q',
            function (authTokenService, $q) {
              var token = authTokenService.getAccessToken();
              if (!token) {
                return $q.reject('AUTH_REQUIRED');
              }
              return true;
            }
          ]
        }
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }

  function configureHttp($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.timeout = 30000;
  }
})();
