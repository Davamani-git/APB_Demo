(function () {
  'use strict';

  angular.module('app.dashboard')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/features/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          resolve: {
            initialMonth: ['dateUtils', function (dateUtils) {
              return dateUtils.getDefaultMonth();
            }]
          }
        });
    }]);
}());
