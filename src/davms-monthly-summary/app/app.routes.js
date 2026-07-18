(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .config(routeConfig);

  routeConfig.$inject = ['$routeProvider'];

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/monthly-summary', {
        templateUrl: 'app/features/monthly-summary/templates/monthly-summary.view.html',
        controller: 'MonthlySummaryController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/monthly-summary'
      });
  }
})();
