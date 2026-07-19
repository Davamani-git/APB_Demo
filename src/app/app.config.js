(function () {
  'use strict';

  config.$inject = ['$httpProvider'];

  angular
    .module('app')
    .config(config);

  function config($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
  }
})();
