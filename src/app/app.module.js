(function() {
  'use strict';
  angular.module('creditCardDashboardModule', ['ngRoute', 'ngResource', 'dashboard'])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);
})();