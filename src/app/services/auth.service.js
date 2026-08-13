(function() {
  'use strict';
  angular.module('app.shopping')
    .service('AuthService', ['$http', '$window', 'API_BASE_URL', function($http, $window, API_BASE_URL) {
      var self = this;
      self.register = function(userData) {
        return $http.post(API_BASE_URL + '/auth/register', userData)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.login = function(credentials) {
        return $http.post(API_BASE_URL + '/auth/login', credentials)
          .then(function(response) {
            if (response.data.authToken) {
              $window.localStorage.setItem('authToken', response.data.authToken);
              $window.localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.logout = function() {
        $window.localStorage.removeItem('authToken');
        $window.localStorage.removeItem('user');
      };
      self.getToken = function() {
        return $window.localStorage.getItem('authToken');
      };
      self.getUser = function() {
        var user = $window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      };
      self.isAuthenticated = function() {
        return !!self.getToken();
      };
    }]);
})();