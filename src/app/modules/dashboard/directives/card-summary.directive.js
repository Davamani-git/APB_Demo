(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('cardSummary', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-summary">' +
          '<div class="card-number">{{::card.cardNumber}}</div>' +
          '<div class="card-holder">{{::card.cardHolderName}}</div>' +
          '<div class="card-metric">' +
          '<div class="card-metric-label">Credit Limit</div>' +
          '<div class="card-metric-value">₹{{::card.creditLimit | number:2}}</div>' +
          '</div>' +
          '<div class="card-metric">' +
          '<div class="card-metric-label">Available Credit</div>' +
          '<div class="card-metric-value">₹{{::card.availableCredit | number:2}}</div>' +
          '</div>' +
          '<div class="card-metric">' +
          '<div class="card-metric-label">Outstanding</div>' +
          '<div class="card-metric-value">₹{{::card.outstandingAmount | number:2}}</div>' +
          '</div>' +
          '<div class="card-metric">' +
          '<div class="card-metric-label">Monthly Spend</div>' +
          '<div class="card-metric-value">₹{{::card.monthlySpend | number:2}}</div>' +
          '</div>' +
          '</div>'
      };
    }]);
})();