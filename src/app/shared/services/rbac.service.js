(function () {
  'use strict';

  angular
    .module('rbacModule')
    .service('RbacService', RbacService);

  RbacService.$inject = ['$http'];

  function RbacService($http) {
    var API_BASE = '/api/rbac';

    this.getCurrentUserRoles = function () {
      return $http.get(API_BASE + '/me/roles')
        .then(function (response) {
          return response.data;
        });
    };

    this.hasRole = function (roles, roleToCheck) {
      if (!Array.isArray(roles)) {
        return false;
      }
      return roles.indexOf(roleToCheck) !== -1;
    };
  }
})();
