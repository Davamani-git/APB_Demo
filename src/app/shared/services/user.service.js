'use strict';

angular.module('shared.services.user', [])
  .service('UserService', ["$http", function($http) {
    var baseUrl = '/api/users';

    this.register = function(user) {
      return $http.post(baseUrl + '/register', user)
        .then(function(response) {
          return response.data;
        });
    };
  }]);
