(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .config(appConfig);

  appConfig.$inject = ['$httpProvider'];

  function appConfig($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }
})();
