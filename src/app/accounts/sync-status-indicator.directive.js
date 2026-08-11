(function() {
  'use strict';
  angular.module('app.accounts')
    .directive('syncStatusIndicator', ['SyncStatusService', '$rootScope', function(SyncStatusService, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          accountId: '='
        },
        template: '<div class="sync-status">' +
          '<span ng-if="status === \'syncing\'"><i class="glyphicon glyphicon-refresh"></i> Syncing...</span>' +
          '<span ng-if="status === \'active\'"><i class="glyphicon glyphicon-ok"></i> Active</span>' +
          '<span ng-if="status === \'error\'"><i class="glyphicon glyphicon-exclamation-sign"></i> Error</span>' +
          '</div>',
        link: function(scope) {
          scope.status = 'active';
          if (scope.accountId) {
            SyncStatusService.startPolling(scope.accountId);
          }
          var listener = $rootScope.$on('syncStatusUpdate', function(event, data) {
            if (data.accountId === scope.accountId) {
              scope.status = data.status;
            }
          });
          scope.$on('$destroy', function() {
            SyncStatusService.stopPolling();
            listener();
          });
        }
      };
    }]);
})();