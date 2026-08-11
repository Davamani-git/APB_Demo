(function() {
  'use strict';
  angular.module('energyDashboard')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/devices', {
          templateUrl: 'src/app/modules/devices/device.view.html',
          controller: 'DeviceController',
          controllerAs: 'vm'
        })
        .when('/devices/manage', {
          templateUrl: 'src/app/modules/devices/device-management.view.html',
          controller: 'DeviceManagementController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();