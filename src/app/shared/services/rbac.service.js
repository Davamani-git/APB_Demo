'use strict';

angular
  .module('sharedServices')
  .service('RbacService', RbacService);

RbacService.$inject = ['$http'];

function RbacService($http) {
  const apiBase = '/api/rbac';

  this.getRolesForUser = function getRolesForUser(userId) {
    return $http.get(apiBase + '/roles', { params: { userId: userId } })
      .then(response => response.data);
  };

  this.hasRole = function hasRole(sessionRoles, requiredRole) {
    if (!Array.isArray(sessionRoles)) {
      return false;
    }
    return sessionRoles.indexOf(requiredRole) !== -1;
  };
}
