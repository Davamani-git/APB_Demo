'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function appConfig($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/insights');

    $httpProvider.interceptors.push('ApiInterceptorService');
  }
})();
