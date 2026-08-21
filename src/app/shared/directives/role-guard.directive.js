'use strict';

angular
  .module('rbacModule')
  .directive('roleGuard', roleGuard);

roleGuard.$inject = ['AuthService'];

function roleGuard(AuthService) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      function applyVisibility() {
        const requiredRole = attrs.roleGuard;
        const roles = AuthService.getRoles();

        if (roles.indexOf(requiredRole) === -1) {
          element.addClass('ng-hide');
        } else {
          element.removeClass('ng-hide');
        }
      }

      applyVisibility();
      scope.$on('auth:rolesUpdated', applyVisibility);
    }
  };
}
