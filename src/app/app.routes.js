(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/views/fraud-dashboard.html',
          controller: 'FraudDashboardController',
          controllerAs: 'vm'
        })
        .when('/config', {
          templateUrl: 'src/app/views/threshold-config.html',
          controller: 'ThresholdConfigController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();