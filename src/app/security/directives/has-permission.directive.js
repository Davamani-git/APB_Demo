(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .directive('hasPermission', ['rbacService', function(rbacService) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var permission = attrs.hasPermission;
          if (!rbacService.hasPermission(permission)) {
            element.remove();
          }
        }
      };
    }]);
})();