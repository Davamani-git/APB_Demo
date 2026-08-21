'use strict';

angular.module('rbacModule')
  .directive('roleGuard', ['RbacService', function(RbacService) {
    return {
      restrict: 'A',
      scope: {
        roleGuard: '@'
      },
      link: function(scope, element) {
        function evaluate() {
          var roles = (scope.roleGuard || '')
            .split(',')
            .map(function(r) { return r.trim(); })
            .filter(Boolean);

          if (roles.length && !RbacService.hasAnyRole(roles)) {
            element.addClass('ng-hide');
          } else {
            element.removeClass('ng-hide');
          }
        }

        scope.$watch('roleGuard', evaluate);
      }
    };
  }]);
