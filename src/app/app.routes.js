(function () {
  'use strict';

  routes.$inject = ['$routeProvider', '$locationProvider'];

  angular
    .module('app')
    .config(routes);

  function routes($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
      .when('/spending/monthly', {
        templateUrl: 'app/spending/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/spending/monthly'
      });
  }
})();
