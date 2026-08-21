'use strict';

angular
  .module('sharedServices')
  .service('UserService', UserService);

UserService.$inject = ['$http'];

function UserService($http) {
  const apiBase = '/api/users';

  this.register = function register(userPayload) {
    return $http.post(apiBase + '/register', userPayload)
      .then(response => response.data);
  };
}
