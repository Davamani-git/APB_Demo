'use strict';

angular.module('shared.services.auth', [])
  .service('AuthService', ["$http", "$q", function($http, $q) {
    var baseUrl = '/api/auth';
    var currentSession = null;

    this.login = function(credentials) {
      return $http.post(baseUrl + '/login', credentials)
        .then(function(response) {
          currentSession = response.data;
          return currentSession;
        });
    };

    this.getSession = function() {
      return currentSession;
    };

    this.isAuthenticated = function() {
      return !!(currentSession && currentSession.token);
    };
  }]);
