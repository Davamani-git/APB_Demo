angular.module('davms.summary').directive('davmsSummaryCards', davmsSummaryCards);

function davmsSummaryCards() {
  return {
    restrict: 'E',
    scope: {
      kpis: '='
    },
    template: [
      '<div class="row" ng-if="kpis">',
      '  <div class="col-md-4">',
      '    <div class="panel panel-primary">',
      '      <div class="panel-heading">',
      '        <h3 class="panel-title">Total Spend</h3>',
      '      </div>',
      '      <div class="panel-body">',
      '        <h2>{{ kpis.totalAmount | currency:kpis.currency }}</h2>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="col-md-4">',
      '    <div class="panel panel-info">',
      '      <div class="panel-heading">',
      '        <h3 class="panel-title">Transactions</h3>',
      '      </div>',
      '      <div class="panel-body">',
      '        <h2>{{ kpis.transactionCount }}</h2>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="col-md-4">',
      '    <div class="panel panel-success">',
      '      <div class="panel-heading">',
      '        <h3 class="panel-title">Average Transaction</h3>',
      '      </div>',
      '      <div class="panel-body">',
      '        <h2>{{ kpis.averageTransactionValue | currency:kpis.currency }}</h2>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')
  };
}