(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('authService', ['$http', '$window', '$q', '$rootScope', function($http, $window, $q, $rootScope) {
      var self = this;
      var TOKEN_KEY = 'jwt_token';
      var USER_KEY = 'current_user';
      self.login = function(credentials) {
        var deferred = $q.defer();
        $http.post('/api/auth/login', credentials)
          .then(function(response) {
            if (response.data && response.data.token) {
              $window.sessionStorage.setItem(TOKEN_KEY, response.data.token);
              $window.sessionStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
              $rootScope.$broadcast('auth:login', response.data.user);
              deferred.resolve(response.data.user);
            } else {
              deferred.reject('Invalid response');
            }
          })
          .catch(function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.logout = function() {
        $window.sessionStorage.removeItem(TOKEN_KEY);
        $window.sessionStorage.removeItem(USER_KEY);
        $rootScope.$broadcast('auth:logout');
      };
      self.getToken = function() {
        return $window.sessionStorage.getItem(TOKEN_KEY);
      };
      self.getCurrentUser = function() {
        var userStr = $window.sessionStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
      };
      self.isAuthenticated = function() {
        return !!self.getToken();
      };
      self.ssoLogin = function() {
        $window.location.href = '/api/auth/sso/redirect';
      };
      self.handleSSOCallback = function(token, user) {
        $window.sessionStorage.setItem(TOKEN_KEY, token);
        $window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        $rootScope.$broadcast('auth:login', user);
      };
      self.recoverAccess = function(email) {
        return $http.post('/api/auth/recover', {email: email});
      };
    }]);
})();