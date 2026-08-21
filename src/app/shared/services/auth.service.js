'use strict';

angular.module('sharedServices')
  .service('AuthService', ['$http', '$window', function($http, $window) {
    var API_BASE = '/api/auth';
    var currentUser = null;

    this.login = function(credentials) {
      return $http.post(API_BASE + '/login', credentials)
        .then(function(response) {
          var data = response.data;
          if (data && data.token) {
            $window.localStorage.setItem('auth_token', data.token);
          }
          currentUser = data.user || null;
          return currentUser;
        });
    };

    this.logout = function() {
      $window.localStorage.removeItem('auth_token');
      currentUser = null;
    };

    this.getCurrentUser = function() {
      if (currentUser) {
        return currentUser;
      }
      var token = $window.localStorage.getItem('auth_token');
      if (!token) {
        return null;
      }
      return currentUser;
    };
  }]);
