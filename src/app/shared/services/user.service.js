(function() {
  'use strict';

  angular
    .module('sharedServices')
    .service('UserService', UserService);

  UserService.$inject = ['$http'];

  function UserService($http) {
    var service = {
      register: register
    };

    return service;

    function register(user) {
      return $http.post('/api/users/register', user)
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
