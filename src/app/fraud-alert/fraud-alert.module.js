(function() {
  'use strict';
  angular.module('fraudAlertModule', ['ngRoute', 'ngResource', 'ui.bootstrap'])
    .constant('API_ENDPOINTS', {
      transactions: '/api/transactions',
      riskEngine: '/api/risk-engine/evaluate',
      fraudAlerts: '/api/fraud-alerts',
      auditLogs: '/api/audit-logs',
      config: '/api/config'
    })
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/fraud-alert/views/alert-dashboard.view.html',
          controller: 'alertDashboardController',
          controllerAs: 'vm'
        })
        .when('/alert/:alertId', {
          templateUrl: 'src/app/fraud-alert/views/alert-detail.view.html',
          controller: 'alertDetailController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }])
    .run(['$http', '$window', 'auditService', function($http, $window, auditService) {
      $http.interceptors.push(['$q', '$injector', function($q, $injector) {
        return {
          request: function(config) {
            const token = $window.localStorage.getItem('authToken');
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },
          responseError: function(rejection) {
            const auditSvc = $injector.get('auditService');
            auditSvc.logError(rejection);
            if (rejection.status === 401 || rejection.status === 403) {
              $window.location.href = '/login';
            }
            return $q.reject(rejection);
          }
        };
      }]);
    }]);
})();