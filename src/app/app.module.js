(function() {
  'use strict';
  angular.module('creditCardDashboardModule', ['ngRoute', 'ui.bootstrap', 'dashboard'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('httpInterceptor');
    }])
    .factory('httpInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $window.location.href = '/login';
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();