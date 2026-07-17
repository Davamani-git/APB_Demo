(function () {
  'use strict';

  angular.module('app.core')
    .service('authTokenService', ['$window', function ($window) {
      var STORAGE_KEY = 'insights_jwt_token';

      this.getToken = function () {
        return $window.sessionStorage.getItem(STORAGE_KEY) || null;
      };

      this.setToken = function (token) {
        if (token) {
          $window.sessionStorage.setItem(STORAGE_KEY, token);
        }
      };

      this.clearToken = function () {
        $window.sessionStorage.removeItem(STORAGE_KEY);
      };

      this.hasValidToken = function () {
        // For mock/demo, treat non-empty token as valid
        var token = this.getToken();
        return !!token;
      };
    }]);
}());
