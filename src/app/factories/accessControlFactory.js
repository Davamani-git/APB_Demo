(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .factory('accessControlFactory', ['authService', '$q', function(authService, $q) {
      var routePermissions = {
        '/dashboard': ['Partner Admin', 'Portfolio Viewer', 'Portfolio Manager']
      };
      return {
        canAccess: function(route) {
          return authService.getUserProfile().then(function(profile) {
            var allowedRoles = routePermissions[route] || [];
            if (!profile || !profile.roles) {
              return $q.reject('No user profile or roles');
            }
            var hasAccess = profile.roles.some(function(role) {
              return allowedRoles.indexOf(role) !== -1;
            });
            if (hasAccess) {
              return $q.resolve(true);
            } else {
              return $q.reject('Access denied');
            }
          }).catch(function() {
            authService.redirectToSSO();
            return $q.reject('Authentication required');
          });
        },
        hasRole: function(role) {
          return authService.getUserProfile().then(function(profile) {
            return profile && profile.roles && profile.roles.indexOf(role) !== -1;
          });
        },
        canAccessCompany: function(companyId) {
          return authService.getUserProfile().then(function(profile) {
            if (!profile.permissions || !profile.permissions.companies) {
              return false;
            }
            return profile.permissions.companies.indexOf(companyId) !== -1;
          });
        }
      };
    }]);
})();