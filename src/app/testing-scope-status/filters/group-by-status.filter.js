(function() {
  'use strict';
  angular.module('executiveDashboardApp').filter('groupByStatus', function() {
    return function(scopes, status) {
      if (!scopes || !status) return [];
      return scopes.filter(function(scope) {
        return scope.status === status;
      });
    };
  });
})();