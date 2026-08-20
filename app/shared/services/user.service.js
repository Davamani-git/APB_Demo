'use strict';

angular
  .module('userModule')
  .service('UserService', UserService);

UserService.$inject = ['$http'];

function UserService($http) {
  var apiBase = '/api/users';

  this.register = function register(user) {
    var payload = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return $http.post(apiBase + '/register', payload);
  };
}
