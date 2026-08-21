'use strict';

angular.module('shared.services.rbac', [])
  .service('RbacService', ["$http", "$q", "AuthService", function($http, $q, AuthService) {
    var baseUrl = '/api/rbac';
    var cachedPermissions = null;

    this.loadPermissions = function() {
      var session = AuthService.getSession();
      if (!session || !session.userId) {
        return $q.reject('No active session');
      }

      return $http.get(baseUrl + '/roles', { params: { userId: session.userId } })
        .then(function(response) {
          cachedPermissions = response.data;
          return cachedPermissions;
        });
    };

    this.hasRole = function(role) {
      if (!cachedPermissions || !cachedPermissions.roles) {
        return false;
      }
      return cachedPermissions.roles.indexOf(role) !== -1;
    };

    this.canAccess = function(permission) {
      if (!cachedPermissions || !cachedPermissions.permissions) {
        return false;
      }
      return cachedPermissions.permissions.indexOf(permission) !== -1;
    };
  }]);
