(function() {
  'use strict';
  angular.module('aiDashboardApp', ['ngRoute'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          resolve: {
            access: ['accessControlFactory', function(accessControlFactory) {
              return accessControlFactory.canAccess('/dashboard');
            }]
          }
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push(['$q', '$window', 'authService', function($q, $window, authService) {
        return {
          request: function(config) {
            var token = authService.getToken();
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },
          responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
              authService.redirectToSSO();
            }
            return $q.reject(rejection);
          }
        };
      }]);
    }])
    .run(['$rootScope', 'accessControlFactory', 'monitoringService', function($rootScope, accessControlFactory, monitoringService) {
      $rootScope.$on('$routeChangeStart', function(event, next) {
        if (next && next.$$route && next.$$route.originalPath) {
          accessControlFactory.canAccess(next.$$route.originalPath).catch(function() {
            event.preventDefault();
          });
        }
      });
      monitoringService.startMonitoring();
    }]);
})();