angular.module('creditCardDashboardModule').directive('creditSummary', [function() {
  return {
    restrict: 'E',
    scope: {
      cards: '='
    },
    template: '<div class="credit-summary panel panel-info">' +
              '  <div class="panel-heading"><h3 class="panel-title">Credit Card Overview</h3></div>' +
              '  <div class="panel-body">' +
              '    <div class="table-responsive">' +
              '      <table class="table table-striped table-hover">' +
              '        <thead>' +
              '          <tr>' +
              '            <th>Card Number</th>' +
              '            <th>Card Type</th>' +
              '            <th>Credit Limit</th>' +
              '            <th>Available Credit</th>' +
              '            <th>Outstanding</th>' +
              '            <th>Monthly Spend</th>' +
              '          </tr>' +
              '        </thead>' +
              '        <tbody>' +
              '          <tr ng-repeat="card in cards">' +
              '            <td>{{card.cardNumber}}</td>' +
              '            <td>{{card.cardType}}</td>' +
              '            <td>${{card.creditLimit | number:2}}</td>' +
              '            <td>${{card.availableCredit | number:2}}</td>' +
              '            <td>${{card.outstandingAmount | number:2}}</td>' +
              '            <td>${{card.currentMonthSpend | number:2}}</td>' +
              '          </tr>' +
              '        </tbody>' +
              '      </table>' +
              '    </div>' +
              '  </div>' +
              '</div>'
  };
}]);