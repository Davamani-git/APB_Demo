(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
