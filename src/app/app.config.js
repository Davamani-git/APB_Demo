(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/fraud-detection/views/dashboard.view.html',
          controller: 'fraudDashboardController',
          controllerAs: 'vm'
        })
        .when('/config', {
          templateUrl: 'src/app/fraud-detection/views/config.view.html',
          controller: 'thresholdConfigController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('httpInterceptor');
    }])
    .constant('apiConfig', {
      baseUrl: '/api',
      endpoints: {
        transactions: '/transactions',
        riskEvaluate: '/fraud-risk/evaluate',
        policyDecision: '/policy/decision',
        alertNotify: '/alerts/notify',
        auditLog: '/audit/log',
        thresholdConfig: '/config/thresholds'
      },
      timeout: 10000
    });
})();