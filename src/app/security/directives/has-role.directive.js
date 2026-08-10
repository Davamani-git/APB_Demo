(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .directive('hasRole', ['rbacService', function(rbacService) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var role = attrs.hasRole;
          if (!rbacService.hasRole(role)) {
            element.remove();
          }
        }
      };
    }]);
})();