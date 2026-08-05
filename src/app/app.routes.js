(function() {
  'use strict';
  angular
    .module('execDashboardApp')
    .config(routeConfig);

  routeConfig.$inject = ['$routeProvider'];
  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<div></div>'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
