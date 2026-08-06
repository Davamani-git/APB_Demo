(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .service('authService', ['$http', '$window', '$q', function($http, $window, $q) {
      var userProfile = null;
      this.getUserProfile = function() {
        if (userProfile) {
          return $q.resolve(userProfile);
        }
        var token = $window.sessionStorage.getItem('authToken');
        if (!token) {
          return $q.reject('No token found');
        }
        return $http.get('/api/auth/profile').then(function(response) {
          userProfile = response.data;
          return userProfile;
        });
      };
      this.getToken = function() {
        return $window.sessionStorage.getItem('authToken');
      };
      this.setToken = function(token) {
        $window.sessionStorage.setItem('authToken', token);
      };
      this.redirectToSSO = function() {
        $window.location.href = '/api/auth/sso/login';
      };
      this.logout = function() {
        userProfile = null;
        $window.sessionStorage.removeItem('authToken');
        this.redirectToSSO();
      };
      this.isAuthenticated = function() {
        return !!this.getToken();
      };
    }]);
})();