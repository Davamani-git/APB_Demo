(function () {
  'use strict';

  angular
    .module('apb.security')
    .service('AuthTokenService', AuthTokenService);

  AuthTokenService.$inject = ['$window'];

  function AuthTokenService($window) {
    var STORAGE_KEY = 'apb_access_token';

    var service = {
      getAccessToken: getAccessToken,
      setAccessToken: setAccessToken,
      clear: clear,
      isTokenExpired: isTokenExpired
    };

    return service;

    function getAccessToken() {
      return $window.sessionStorage.getItem(STORAGE_KEY);
    }

    function setAccessToken(token) {
      if (token) {
        $window.sessionStorage.setItem(STORAGE_KEY, token);
      }
    }

    function clear() {
      $window.sessionStorage.removeItem(STORAGE_KEY);
    }

    function isTokenExpired() {
      // No real token parsing implemented; front-end treats missing token as expired.
      return !getAccessToken();
    }
  }
})();
