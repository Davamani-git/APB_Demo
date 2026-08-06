(function() {
  'use strict';
  angular.module('shoppingPlatform').service('RBACService', ['AuthService', 'PermissionFactory', function(AuthService, PermissionFactory) {
    this.hasRole = function(requiredRole) {
      if (!AuthService.isAuthenticated()) {
        return false;
      }
      var userRole = AuthService.getUserRole();
      return userRole === requiredRole || userRole === 'admin';
    };
    this.hasPermission = function(permission) {
      var userRole = AuthService.getUserRole();
      return PermissionFactory.checkPermission(userRole, permission);
    };
    this.validateRole = function(requiredRole) {
      if (!this.hasRole(requiredRole)) {
        throw new Error('Unauthorized access');
      }
      return true;
    };
  }]);
})();