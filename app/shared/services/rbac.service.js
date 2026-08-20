'use strict';

angular
  .module('rbacModule')
  .service('RbacService', RbacService);

RbacService.$inject = ['$http', '$q'];

function RbacService($http, $q) {
  var apiBase = '/api/rbac';
  var cachedRoles = null;

  this.loadRolesForCurrentUser = function loadRolesForCurrentUser() {
    if (cachedRoles) {
      return $q.resolve(cachedRoles);
    }

    return $http
      .get(apiBase + '/me/roles')
      .then(function onRolesLoaded(response) {
        cachedRoles = response.data.roles || [];
        return cachedRoles;
      });
  };

  this.hasRole = function hasRole(role) {
    if (!cachedRoles) {
      return false;
    }
    return cachedRoles.indexOf(role) !== -1;
  };

  this.canAccess = function canAccess(permission) {
    if (!cachedRoles || !permission) {
      return false;
    }
    // Simplified: assume API encodes permission in roles string
    return cachedRoles.indexOf(permission) !== -1;
  };
}
