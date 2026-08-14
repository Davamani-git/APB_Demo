(function() {
  'use strict';
  angular.module('energyMonitoringApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/energy-monitoring/views/dashboard.view.html',
        controller: 'EnergyDashboardController',
        controllerAs: 'vm'
      })
      .when('/devices', {
        templateUrl: 'src/app/energy-monitoring/views/devices.view.html',
        controller: 'DeviceListController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          const token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access');
          } else if (rejection.status >= 500) {
            console.error('Server error:', rejection.statusText);
          }
          return $q.reject(rejection);
        }
      };
    }]);
  }]);
})();