(function() {
  'use strict';
  angular.module('fraudDetection', [
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'fraudDetection.ingestion',
    'fraudDetection.riskEngine',
    'fraudDetection.policy',
    'fraudDetection.alerts',
    'fraudDetection.notification',
    'fraudDetection.response',
    'fraudDetection.protection',
    'fraudDetection.audit'
  ])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/alerts', {
        template: '<alert-list-component></alert-list-component>',
        controller: 'AlertController',
        controllerAs: 'vm'
      })
      .when('/alerts/:alertId', {
        template: '<alert-detail-component alert-id="{{alertId}}"></alert-detail-component>',
        controller: 'AlertDetailController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/alerts'
      });
    $httpProvider.interceptors.push('FraudApiInterceptor');
  }])
  .constant('API_ENDPOINTS', {
    BASE_URL: '/api',
    TRANSACTIONS: '/api/transactions',
    RISK_SCORING: '/api/risk/score',
    POLICY_DECISIONS: '/api/policy/decisions',
    THRESHOLDS: '/api/policy/thresholds',
    ALERTS: '/api/alerts',
    NOTIFICATIONS: '/api/notifications',
    RESPONSES: '/api/alerts/:alertId/response',
    PROTECTION: '/api/protection/initiate',
    AUDIT: '/api/audit/events'
  });
})();