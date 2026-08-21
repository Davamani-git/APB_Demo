(function() {
  'use strict';

  angular
    .module('sharedServices')
    .service('RbacService', RbacService);

  RbacService.$inject = ['$http'];

  function RbacService($http) {
    var currentRoles = [];
    var permissionsCache = {};

    var service = {
      loadRolesForUser: loadRolesForUser,
      hasRole: hasRole,
      hasPermission: hasPermission
    };

    return service;

    function loadRolesForUser(userId) {
      return $http.get('/api/rbac/roles', { params: { userId: userId } })
        .then(function(response) {
          currentRoles = response.data.roles || [];
          permissionsCache = response.data.permissionsByRole || {};
          return {
            roles: currentRoles,
            permissionsByRole: permissionsCache
          };
        });
    }

    function hasRole(role) {
      return currentRoles.indexOf(role) !== -1;
    }

    function hasPermission(permission) {
      return currentRoles.some(function(role) {
        var rolePermissions = permissionsCache[role] || [];
        return rolePermissions.indexOf(permission) !== -1;
      });
    }
  }
})();
