(function () {
  'use strict';

  angular
    .module('execSummary.directives')
    .directive('progressBar', [function () {
      return {
        restrict: 'E',
        scope: {
          value: '=',
          label: '@',
          status: '@'
        },
        templateUrl: 'src/app/views/progress-bar.html',
        link: function (scope) {
          scope.getBarClass = function () {
            if (scope.status === 'COMPLETED') {
              return 'bg-success';
            }
            if (scope.status === 'DESIGN_IN_PROGRESS') {
              return 'bg-info';
            }
            return 'bg-warning';
          };
        }
      };
    }]);
})();