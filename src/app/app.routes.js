(function () {
  'use strict';

  routesConfig.$inject = ['$routeProvider'];

  function routesConfig($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/dashboard/spending-summary'
      });
  }

  angular.module('app')
    .config(routesConfig);
})();
