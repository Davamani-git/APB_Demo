(function () {
  'use strict';

  angular
    .module('apb.security')
    .service('AuthTokenService', AuthTokenService);

  AuthTokenService.$inject = ['$window'];

  function AuthTokenService($window) {
    var storageKey = 'apb_access_token';

    var service = {
      getAccessToken: getAccessToken,
      setAccessToken: setAccessToken,
      clear: clear,
      isTokenExpired: isTokenExpired
    };

    return service;

    function getAccessToken() {
      return $window.sessionStorage.getItem(storageKey) || null;
    }

    function setAccessToken(token) {
      if (token) {
        $window.sessionStorage.setItem(storageKey, token);
      }
    }

    function clear() {
      $window.sessionStorage.removeItem(storageKey);
    }

    function isTokenExpired() {
      return false;
    }
  }
})();
