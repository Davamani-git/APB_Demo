(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .service('RbacService', RbacService);

  RbacService.$inject = ['AuthService'];

  function RbacService(AuthService) {
    this.canViewInsights = function () {
      const user = AuthService.getCurrentUser();
      return !!(user && Array.isArray(user.roles) && user.roles.indexOf('INSIGHTS_VIEW') !== -1);
    };

    this.canViewAggregatedMetrics = function () {
      const user = AuthService.getCurrentUser();
      return !!(user && Array.isArray(user.roles) && user.roles.indexOf('INSIGHTS_AGG_VIEW') !== -1);
    };

    this.isActionAllowed = function (actionCode, context) {
      const user = AuthService.getCurrentUser();
      if (!user || !Array.isArray(user.roles)) {
        return false;
      }
      // Minimal implementation: allow based on role-name containing actionCode.
      return user.roles.some(function (role) {
        return role === actionCode;
      });
    };
  }
})();
