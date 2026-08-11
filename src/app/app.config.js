(function() {
  'use strict';
  angular.module('energyDashboard')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        realtime: '/energy/realtime',
        historical: '/energy/historical',
        devices: '/devices',
        pricing: '/pricing/current'
      },
      timeout: 10000
    })
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    }]);
})();