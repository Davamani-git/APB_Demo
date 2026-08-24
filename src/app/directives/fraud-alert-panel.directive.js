angular.module('fraudDetection').directive('fraudAlertPanel', ['AlertNotificationService', '$timeout', function(AlertNotificationService, $timeout) {
  return {
    restrict: 'E',
    template: '<div>' +
      '<div ng-if="alerts.length === 0" style="padding: 20px; text-align: center; color: #7f8c8d;">No active fraud alerts</div>' +
      '<div ng-repeat="alert in alerts" class="alert-panel" ng-class="alert.riskLevel">' +
      '<div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Fraud Alert: {{alert.riskLevel | uppercase}}</div>' +
      '<div><strong>Transaction ID:</strong> {{alert.transactionId}}</div>' +
      '<div><strong>Amount:</strong> {{alert.transaction.amount}} {{alert.transaction.currency}}</div>' +
      '<div><strong>Merchant:</strong> {{alert.transaction.merchantName}}</div>' +
      '<div><strong>Card:</strong> {{alert.transaction.cardNumber}}</div>' +
      '<div><strong>Time:</strong> {{alert.transaction.timestamp | date:"medium"}}</div>' +
      '<div><strong>Location:</strong> {{alert.transaction.location.city}}, {{alert.transaction.location.country}}</div>' +
      '<div style="margin-top: 10px;"><strong>Risk Score:</strong> {{alert.riskScore}}</div>' +
      '<div style="margin-top: 10px;"><strong>Action Taken:</strong> {{alert.actionTaken}}</div>' +
      '<div style="margin-top: 15px;">' +
      '<button class="btn btn-success" ng-click="confirmTransaction(alert)" ng-disabled="alert.status === \'resolved\'">Yes, this was me</button>' +
      '<button class="btn btn-danger" ng-click="reportTransaction(alert)" ng-disabled="alert.status === \'resolved\'">No, I don\'t recognize this</button>' +
      '</div>' +
      '<div ng-if="alert.status === \'resolved\'" style="margin-top: 10px; color: #27ae60; font-weight: bold;">Status: {{alert.resolution}}</div>' +
      '</div>' +
      '</div>',
    link: function(scope, element, attrs) {
      scope.alerts = [];
      
      scope.loadAlerts = function() {
        scope.alerts = AlertNotificationService.getActiveAlerts();
      };
      
      scope.confirmTransaction = function(alert) {
        AlertNotificationService.resolveAlert(alert.alertId, 'confirmed_legitimate').then(function() {
          scope.loadAlerts();
        }).catch(function(error) {
          alert.status = 'resolved';
          alert.resolution = 'confirmed_legitimate';
        });
      };
      
      scope.reportTransaction = function(alert) {
        AlertNotificationService.resolveAlert(alert.alertId, 'reported_fraud').then(function() {
          scope.loadAlerts();
        }).catch(function(error) {
          alert.status = 'resolved';
          alert.resolution = 'reported_fraud';
        });
      };
      
      scope.$on('fraud-alert-created', function(event, alert) {
        scope.loadAlerts();
      });
      
      scope.$on('fraud-alert-resolved', function(event, data) {
        scope.loadAlerts();
      });
      
      scope.loadAlerts();
      
      var refreshInterval = $timeout(function refresh() {
        scope.loadAlerts();
        refreshInterval = $timeout(refresh, 5000);
      }, 5000);
      
      scope.$on('$destroy', function() {
        if (refreshInterval) {
          $timeout.cancel(refreshInterval);
        }
      });
    }
  };
}]);