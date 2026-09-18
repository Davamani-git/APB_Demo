(function() {
  'use strict';
  angular.module('fraudDetectionApp', ['fraudDetection.ingestion', 'fraudDetection.alerts'])
    .constant('API_CONFIG', {
      baseUrl: '/api',
      fraudRiskEngineUrl: '/api/fraud-risk',
      alertsUrl: '/api/alerts',
      auditUrl: '/api/audit',
      authUrl: '/api/auth'
    })
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);
})();