(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .factory('AuthInterceptor', AuthInterceptor)
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);

  AuthInterceptor.$inject = ['$q', 'UserContextService'];
  function AuthInterceptor($q, UserContextService) {
    return {
      request: function (config) {
        var token = UserContextService.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function (rejection) {
        return $q.reject(rejection);
      }
    };
  }
})();
