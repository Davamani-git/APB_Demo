(function () {
  'use strict';

  angular
    .module('rbApp')
    .config(appConfig)
    .config(httpConfig);

  appConfig.$inject = ['$routeProvider'];
  httpConfig.$inject = ['$httpProvider'];

  function appConfig($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/insights'
    });
  }

  function httpConfig($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
  }
})();
