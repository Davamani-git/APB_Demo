(function() {
  'use strict';

  angular
    .module('rbacModule')
    .directive('roleGuard', roleGuard);

  roleGuard.$inject = ['RbacService'];

  function roleGuard(RbacService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var allowedRoles = (attrs.roleGuard || '').split(',')
          .map(function(role) { return role.trim(); })
          .filter(Boolean);

        function applyVisibility() {
          var visible = allowedRoles.length === 0 || allowedRoles.some(function(role) {
            return RbacService.hasRole(role);
          });

          if (visible) {
            element.removeClass('ng-hide');
          } else {
            element.addClass('ng-hide');
          }
        }

        scope.$watch(function() {
          return allowedRoles.map(function(role) { return RbacService.hasRole(role); }).join(',');
        }, applyVisibility);

        applyVisibility();
      }
    };
  }
})();
