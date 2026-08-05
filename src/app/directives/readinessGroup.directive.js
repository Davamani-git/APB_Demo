(function () {
  'use strict';

  angular
    .module('execSummary.directives')
    .directive('readinessGroup', [function () {
      return {
        restrict: 'E',
        scope: {
          groupName: '@',
          scopes: '='
        },
        templateUrl: 'src/app/views/readiness-group.html'
      };
    }]);
})();