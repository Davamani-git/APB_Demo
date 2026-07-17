(function () {
  'use strict';

  angular.module('app')
    .config(['$routeProvider', '$locationProvider',
      function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);

        $routeProvider
          .otherwise({
            redirectTo: '/dashboard'
          });
      }
    ]);
}());
