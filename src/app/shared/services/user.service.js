'use strict';

angular.module('sharedServices')
  .service('UserService', ['$http', '$q', function($http, $q) {
    var API_BASE = '/api/users';

    this.register = function(payload) {
      if (!payload || !payload.email || !payload.password) {
        return $q.reject(new Error('Missing required registration fields'));
      }
      return $http.post(API_BASE + '/register', payload)
        .then(function(response) {
          return response.data;
        });
    };

    this.getProfile = function() {
      return $http.get(API_BASE + '/me')
        .then(function(response) {
          return response.data;
        });
    };
  }]);
