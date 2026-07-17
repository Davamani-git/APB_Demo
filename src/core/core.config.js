(function () {
  'use strict';

  angular
    .module('apb.core')
    .config(coreConfig);

  coreConfig.$inject = ['$httpProvider'];

  function coreConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthHttpInterceptor');
  }
})();
