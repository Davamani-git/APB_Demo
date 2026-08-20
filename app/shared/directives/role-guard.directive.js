'use strict';

angular
  .module('rbacModule')
  .directive('roleGuard', roleGuardDirective);

roleGuardDirective.$inject = ['RbacService'];

function roleGuardDirective(RbacService) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      var requiredRole = attrs.roleGuard;

      RbacService
        .loadRolesForCurrentUser()
        .then(function onRolesLoaded() {
          if (!RbacService.hasRole(requiredRole)) {
            element.addClass('ng-hide');
          }
        })
        .catch(function onError() {
          element.addClass('ng-hide');
        });
    }
  };
}
