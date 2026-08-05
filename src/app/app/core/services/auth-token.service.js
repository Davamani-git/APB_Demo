(function () {
  'use strict';

  angular
    .module('ccd.core')
    .factory('authTokenService', [
      '$window',
      function ($window) {
        var storageKey = 'ccd_access_token';

        return {
          getAccessToken: function () {
            try {
              return $window.sessionStorage.getItem(storageKey);
            } catch (e) {
              return null;
            }
          },
          setAccessToken: function (token) {
            try {
              $window.sessionStorage.setItem(storageKey, token);
            } catch (e) {
            }
          },
          clear: function () {
            try {
              $window.sessionStorage.removeItem(storageKey);
            } catch (e) {
            }
          }
        };
      }
    ]);
})();
