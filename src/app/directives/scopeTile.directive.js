(function () {
  'use strict';

  angular
    .module('execSummary.directives')
    .directive('scopeTile', ['AccessControlService', function (AccessControlService) {
      return {
        restrict: 'E',
        scope: {
          scopeData: '=',
          onEdit: '&',
          readonly: '='
        },
        templateUrl: 'src/app/views/scope-tile.html',
        link: function (scope) {
          scope.canEdit = function () {
            if (scope.readonly) {
              return false;
            }
            return AccessControlService.canEditScope(scope.scopeData.id);
          };

          scope.edit = function () {
            if (!scope.canEdit()) {
              return;
            }
            scope.onEdit({ scopeId: scope.scopeData.id });
          };
        }
      };
    }]);
})();