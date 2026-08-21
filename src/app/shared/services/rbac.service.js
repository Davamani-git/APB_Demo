'use strict';

angular.module('sharedServices')
  .service('RbacService', ['AuthService', '$http', function(AuthService, $http) {
    var API_BASE = '/api/rbac';
    var currentPermissions = [];

    this.loadPermissionsForCurrentUser = function() {
      var user = AuthService.getCurrentUser();
      if (!user || !user.id) {
        currentPermissions = [];
        return Promise.resolve([]);
      }
      return $http.get(API_BASE + '/permissions', { params: { userId: user.id } })
        .then(function(response) {
          currentPermissions = response.data.permissions || [];
          return currentPermissions;
        });
    };

    this.hasPermission = function(permission) {
      return currentPermissions.indexOf(permission) !== -1;
    };

    this.hasAnyRole = function(roles) {
      var user = AuthService.getCurrentUser();
      if (!user || !user.roles) {
        return false;
      }
      return roles.some(function(role) {
        return user.roles.indexOf(role) !== -1;
      });
    };
  }]);
