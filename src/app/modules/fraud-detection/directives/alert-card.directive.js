(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .directive('alertCard', ['AlertCreationService', function(AlertCreationService) {
      return {
        restrict: 'E',
        scope: {
          alertData: '='
        },
        template: '<div class="alert-card {{alertData.severity}}">' +
                  '  <div class="alert-header">' +
                  '    <div>' +
                  '      <strong>Alert ID:</strong> {{alertData.alert_id}}<br>' +
                  '      <strong>Transaction:</strong> {{alertData.transaction_id}}<br>' +
                  '      <strong>Customer:</strong> {{alertData.customer_id}}' +
                  '    </div>' +
                  '    <div>' +
                  '      <span class="alert-status status-{{alertData.status}}">{{alertData.status | uppercase}}</span>' +
                  '    </div>' +
                  '  </div>' +
                  '  <div>' +
                  '    <strong>Severity:</strong> <span style="text-transform: uppercase;">{{alertData.severity}}</span><br>' +
                  '    <strong>Created:</strong> {{alertData.created_at | date:"short"}}<br>' +
                  '    <strong>Expires:</strong> {{alertData.expires_at | date:"short"}}' +
                  '  </div>' +
                  '  <div style="margin-top: 10px;" ng-if="alertData.status === \'created\'">' +
                  '    <button ng-click="resolveAlert()">Resolve Alert</button>' +
                  '  </div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.resolveAlert = function() {
            AlertCreationService.resolveAlert(scope.alertData.alert_id)
              .then(function(updatedAlert) {
                scope.alertData.status = 'resolved';
                scope.alertData.resolved_at = updatedAlert.resolved_at;
              })
              .catch(function(error) {
                console.error('Failed to resolve alert:', error);
              });
          };
        }
      };
    }]);
})();