(function () {
  'use strict';

  angular
    .module('apb.core')
    .config(configure);

  configure.$inject = ['$httpProvider'];

  function configure($httpProvider) {
    $httpProvider.interceptors.push('AuthHttpInterceptor');
  }
})();
