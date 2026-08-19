(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .constant('API_ENDPOINTS', {
      BASE_URL: '/api',
      FRAUD_RISK_EVALUATE: '/api/fraud-risk/evaluate',
      ALERTS_FRAUD: '/api/alerts/fraud',
      AUDIT_DECISION: '/api/audit/fraud-decision',
      CONFIG_THRESHOLDS: '/api/config/thresholds',
      TRANSACTIONS: '/api/transactions'
    })
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
        return {
          request: function(config) {
            var token = localStorage.getItem('authToken');
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },
          responseError: function(rejection) {
            if (rejection.status === 401) {
              console.error('Unauthorized access');
            } else if (rejection.status === 500) {
              console.error('Server error:', rejection.data);
            }
            return $q.reject(rejection);
          }
        };
      }]);
    }]);
})();