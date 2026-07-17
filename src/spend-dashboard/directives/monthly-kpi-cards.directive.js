(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .directive('monthlyKpiCards', monthlyKpiCards);

  function monthlyKpiCards() {
    return {
      restrict: 'E',
      scope: {
        summary: '='
      },
      template: [
        '<div class="row" ng-if="summary">',
        '  <div class="col-sm-4">',
        '    <div class="panel panel-primary apb-kpi-card">',
        '      <div class="panel-heading">Total Monthly Spend</div>',
        '      <div class="panel-body">',
        '        <h3>{{summary.totalSpend | currencyShort:summary.currency}}</h3>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="col-sm-4">',
        '    <div class="panel panel-success apb-kpi-card">',
        '      <div class="panel-heading">Number of Transactions</div>',
        '      <div class="panel-body">',
        '        <h3>{{summary.transactionCount}}</h3>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="col-sm-4">',
        '    <div class="panel panel-info apb-kpi-card">',
        '      <div class="panel-heading">Average Transaction Value</div>',
        '      <div class="panel-body">',
        '        <h3>{{summary.averageTransactionValue | currencyShort:summary.currency}}</h3>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '<div class="alert alert-info" ng-if="!summary">',
        '  No summary available for the selected month.',
        '</div>'
      ].join('')
    };
  }
})();
