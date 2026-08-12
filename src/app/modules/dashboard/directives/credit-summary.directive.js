(function() {
  'use strict';
  angular.module('dashboard')
    .directive('creditSummary', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          maskCard: '&',
          formatCurrency: '&'
        },
        template: '<div class="card-table">' +
                  '<h3>Credit Card Portfolio</h3>' +
                  '<table class="table table-striped table-hover">' +
                  '<thead>' +
                  '<tr>' +
                  '<th>Card Number</th>' +
                  '<th>Card Type</th>' +
                  '<th>Credit Limit</th>' +
                  '<th>Outstanding</th>' +
                  '<th>Available Credit</th>' +
                  '</tr>' +
                  '</thead>' +
                  '<tbody>' +
                  '<tr ng-repeat="card in cards">' +
                  '<td class="card-number">{{ maskCard({ cardNumber: card.cardNumber }) }}</td>' +
                  '<td>{{ card.cardType }}</td>' +
                  '<td>{{ formatCurrency({ amount: card.creditLimit }) }}</td>' +
                  '<td>{{ formatCurrency({ amount: card.outstandingAmount }) }}</td>' +
                  '<td>{{ formatCurrency({ amount: card.availableCredit }) }}</td>' +
                  '</tr>' +
                  '</tbody>' +
                  '</table>' +
                  '</div>'
      };
    }]);
})();