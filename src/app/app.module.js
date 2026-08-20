(function() {
  'use strict';
  angular.module('fraudDetectionApp', [])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
    }])
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        transactions: '/transactions/events',
        riskScore: '/fraud/risk-score',
        policyThresholds: '/policy/thresholds',
        auditLog: '/audit/risk-decisions'
      },
      retryAttempts: 3,
      retryDelay: 1000
    });
})();