angular.module('fraudDetectionApp').directive('transactionMonitor', [function() {
  return {
    restrict: 'E',
    scope: {
      transactions: '='
    },
    template: '<div>' +
      '<div ng-if="transactions.length === 0" style="text-align: center; padding: 20px; color: #999;">' +
        '<p>No transactions to display</p>' +
      '</div>' +
      '<div ng-repeat="item in transactions" class="transaction-card risk-{{item.riskDecision.riskLevel}}">' +
        '<div class="transaction-header">' +
          '<div>' +
            '<span class="transaction-amount">{{item.transaction.currency}} {{item.transaction.amount | number:2}}</span>' +
            '<span ng-if="item.riskDecision.alertTriggered" class="alert-indicator alert-triggered"></span>' +
          '</div>' +
          '<span class="risk-badge {{item.riskDecision.riskLevel}}">{{item.riskDecision.riskLevel | uppercase}}</span>' +
        '</div>' +
        '<div class="transaction-details">' +
          '<strong>Merchant:</strong> {{item.transaction.merchantName}}<br>' +
          '<strong>Card:</strong> {{item.transaction.cardNumber | limitTo: -4}}<br>' +
          '<strong>Transaction ID:</strong> {{item.transaction.transactionId}}<br>' +
          '<strong>Time:</strong> {{item.transaction.timestamp | date:"medium"}}<br>' +
          '<strong>Location:</strong> {{item.transaction.location.country || "N/A"}}<br>' +
          '<strong>Risk Score:</strong> {{item.riskDecision.riskScore}}<br>' +
          '<strong>Decision:</strong> {{item.riskDecision.decisionReason}}' +
        '</div>' +
        '<div ng-if="item.riskDecision.getActiveSignals().length > 0" class="risk-signals">' +
          '<strong>Risk Signals Detected:</strong>' +
          '<ul>' +
            '<li ng-repeat="signal in item.riskDecision.getActiveSignals()">{{signal}}</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>',
    link: function(scope, element, attrs) {
      scope.$watch('transactions', function(newVal) {
        if (newVal) {
          console.log('Transaction monitor updated with', newVal.length, 'transactions');
        }
      });
    }
  };
}]);