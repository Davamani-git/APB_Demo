(function() {
  'use strict';

  function summaryKpiCards() {
    return {
      restrict: 'E',
      scope: {
        kpis: '='
      },
      template: [
        '<div class="davms-kpi-cards row" ng-if="kpis && kpis.length">',
        '  <div class="col-sm-4" ng-repeat="kpi in kpis">',
        '    <div class="panel panel-default">',
        '      <div class="panel-heading">{{kpi.label}}</div>',
        '      <div class="panel-body">',
        '        <span class="davms-kpi-value">{{kpi.value}}</span>',
        '        <span class="davms-kpi-unit" ng-if="kpi.unit">&nbsp;{{kpi.unit}}</span>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',
        '<div class="davms-no-data-message" ng-if="!kpis || !kpis.length">',
        '  No key metrics are available for the selected month.',
        '</div>'
      ].join('')
    };
  }

  angular.module('davms.spendDashboard')
    .directive('summaryKpiCards', summaryKpiCards);
})();
