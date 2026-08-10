(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .directive('cloudProviderStatus', ['freshnessMonitorService', function(freshnessMonitorService) {
      return {
        restrict: 'E',
        scope: {
          connection: '='
        },
        template: '<span class="status-badge status-{{statusClass}}">{{statusText}}</span>',
        link: function(scope, element, attrs) {
          scope.$watch('connection', function(conn) {
            if (!conn) return;
            var isFresh = freshnessMonitorService.isDataFresh(conn.companyId);
            if (conn.status === 'connected' && isFresh) {
              scope.statusClass = 'connected';
              scope.statusText = 'Connected';
            } else if (conn.status === 'connected' && !isFresh) {
              scope.statusClass = 'stale';
              scope.statusText = 'Stale Data';
            } else {
              scope.statusClass = 'disconnected';
              scope.statusText = 'Disconnected';
            }
          }, true);
        }
      };
    }]);
})();