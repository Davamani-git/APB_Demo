(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .constant('API_ENDPOINT', '/api')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/device-connection', {
          templateUrl: 'src/app/wearable-integration/device-connection.view.html',
          controller: 'DeviceConnectionController',
          controllerAs: 'vm'
        })
        .when('/dashboard', {
          templateUrl: 'src/app/wearable-integration/activity-dashboard.view.html',
          controller: 'ActivityDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }])
    .run(['$http', function($http) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('authToken');
    }]);
})();