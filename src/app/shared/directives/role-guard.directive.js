'use strict';

angular.module('rbacModule')
  .directive('roleGuard', ["RbacService", function(RbacService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var requiredRole = attrs.roleGuard;

        function updateVisibility() {
          if (RbacService.hasRole(requiredRole)) {
            element.removeClass('ng-hide');
          } else {
            element.addClass('ng-hide');
          }
        }

        scope.$watch(function() {
          return RbacService.hasRole(requiredRole);
        }, function() {
          updateVisibility();
        });

        updateVisibility();
      }
    };
  }]);
