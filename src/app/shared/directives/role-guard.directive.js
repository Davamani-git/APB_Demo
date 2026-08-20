(function () {
  'use strict';

  angular
    .module('rbacModule')
    .directive('roleGuard', roleGuardDirective);

  roleGuardDirective.$inject = ['RbacService'];

  function roleGuardDirective(RbacService) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        RbacService.getCurrentUserRoles().then(function (data) {
          var roles = data.roles || [];
          var requiredRole = attrs.roleGuard;
          if (!RbacService.hasRole(roles, requiredRole)) {
            element.addClass('ng-hide');
          }
        });
      }
    };
  }
})();
