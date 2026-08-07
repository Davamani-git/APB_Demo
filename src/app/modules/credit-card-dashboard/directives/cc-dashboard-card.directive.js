(function() {
  'use strict';
  angular.module('app.creditCardDashboard')
    .directive('ccDashboardCard', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-item">' +
                  '  <div class="card-header">{{card.cardType}}</div>' +
                  '  <div class="card-detail">' +
                  '    <div class="card-detail-label">Card Number</div>' +
                  '    <div class="card-detail-value">{{card.cardNumber}}</div>' +
                  '  </div>' +
                  '  <div class="row">' +
                  '    <div class="col-xs-6 col-sm-3">' +
                  '      <div class="card-detail">' +
                  '        <div class="card-detail-label">Credit Limit</div>' +
                  '        <div class="card-detail-value">₹{{card.totalCreditLimit | number:0}}</div>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="col-xs-6 col-sm-3">' +
                  '      <div class="card-detail">' +
                  '        <div class="card-detail-label">Available Credit</div>' +
                  '        <div class="card-detail-value">₹{{card.availableCredit | number:0}}</div>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="col-xs-6 col-sm-3">' +
                  '      <div class="card-detail">' +
                  '        <div class="card-detail-label">Monthly Spend</div>' +
                  '        <div class="card-detail-value">₹{{card.monthlySpend | number:0}}</div>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="col-xs-6 col-sm-3">' +
                  '      <div class="card-detail">' +
                  '        <div class="card-detail-label">Outstanding</div>' +
                  '        <div class="card-detail-value">₹{{card.outstandingAmount | number:0}}</div>' +
                  '      </div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    }]);
})();