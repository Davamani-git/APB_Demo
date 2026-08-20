(function () {
  'use strict';

  angular
    .module('userModule')
    .service('UserService', UserService);

  UserService.$inject = ['$http'];

  function UserService($http) {
    var API_BASE = '/api/users';

    this.register = function (userPayload) {
      return $http.post(API_BASE + '/register', userPayload)
        .then(function (response) {
          return response.data;
        });
    };
  }
})();
