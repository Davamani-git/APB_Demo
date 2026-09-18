(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('AuthService', ['$http', '$q', 'ApiConfigFactory', AuthService]);
  function AuthService($http, $q, ApiConfigFactory) {
    var currentUser = null;
    this.getCurrentUser = function() {
      if (currentUser) return $q.resolve(currentUser);
      return $http.get(ApiConfigFactory.getEndpoint('/auth/current')).then(function(response) {
        currentUser = response.data;
        return currentUser;
      });
    };
    this.hasRole = function(role) {
      return currentUser && currentUser.roles && currentUser.roles.indexOf(role) !== -1;
    };
    this.getUserId = function() {
      return currentUser ? currentUser.userId : null;
    };
  }
  AuthService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();