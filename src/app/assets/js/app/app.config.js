(function(){
  'use strict';
  angular.module('appmrn25DashboardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
      $routeProvider.otherwise({
        redirectTo: '/dashboard'
      });
      $httpProvider.interceptors.push('AuthInterceptor');
      $httpProvider.interceptors.push('ErrorInterceptor');
    }]);
})();
