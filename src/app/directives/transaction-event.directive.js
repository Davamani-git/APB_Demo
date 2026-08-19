(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .directive('transactionEvent', [function() {
      return {
        restrict: 'E',
        scope: {
          transaction: '=',
          riskLevel: '@'
        },
        template: '<div class="transaction-event" ng-class="riskLevel">' +
                  '  <div class="transaction-header">' +
                  '    <span class="transaction-id">{{transaction.transactionId}}</span>' +
                  '    <span class="risk-indicator" ng-class="riskLevel">{{riskLevel}}</span>' +
                  '  </div>' +
                  '  <div class="transaction-details">' +
                  '    <div>Card: {{transaction.cardNumber}}</div>' +
                  '    <div>Amount: {{transaction.amount | currency:transaction.currency}}</div>' +
                  '    <div>Merchant: {{transaction.merchantName}}</div>' +
                  '    <div>Time: {{transaction.transactionTimestamp | date:"short"}}</div>' +
                  '  </div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.$watch('riskLevel', function(newVal) {
            element.find('.risk-indicator').removeClass('low medium high confirmed_fraud');
            if (newVal) {
              element.find('.risk-indicator').addClass(newVal);
            }
          });
        }
      };
    }]);
})();