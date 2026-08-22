(function () {
  'use strict';

  angular
    .module('apb.auth')
    .factory('RegistrationService', RegistrationService);

  RegistrationService.$inject = ['$http'];

  function RegistrationService($http) {
    var service = {
      register: register
    };

    return service;

    function register(user) {
      var payload = {
        email: user.email,
        password: user.password
      };

      return $http.post('/api/auth/register', payload)
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
