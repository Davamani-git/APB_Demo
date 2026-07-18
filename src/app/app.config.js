(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .config(AppConfig);

  AppConfig.$inject = ['$httpProvider'];

  function AppConfig($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
  }
})();
