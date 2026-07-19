(function() {
  'use strict';

  configureRoutes.$inject = ['$routeProvider', '$locationProvider'];

  function configureRoutes($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/templates/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }

  angular.module('app')
    .config(configureRoutes);
})();
