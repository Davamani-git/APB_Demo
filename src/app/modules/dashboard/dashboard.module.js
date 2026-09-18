(function() {
  'use strict';
  angular.module('dashboardModule', ['ngRoute', 'ui.bootstrap']).config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/dashboard.view.html',
        controller: 'dashboardController',
        controllerAs: 'vm'
      })
      .when('/company/:companyId', {
        templateUrl: 'src/app/modules/dashboard/company-detail.view.html',
        controller: 'companyDetailController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    $httpProvider.interceptors.push(['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.sessionStorage.getItem('sso_token');
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            $window.sessionStorage.removeItem('sso_token');
            $window.location.href = '/login';
          }
          return $q.reject(rejection);
        }
      };
    }]);
  }]).run(['authService', 'rbacService', function(authService, rbacService) {
    if (authService.isAuthenticated()) {
      rbacService.loadUserPermissions();
    }
  }]);
})();