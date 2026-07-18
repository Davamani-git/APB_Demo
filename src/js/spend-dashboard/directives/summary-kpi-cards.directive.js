(function () {
  'use strict';

  function summaryKpiCards() {
    return {
      restrict: 'E',
      scope: {
        kpis: '='
      },
      template: [
        '<div class="kpi-cards-container row">',
        '  <div class="col-sm-4" ng-repeat="kpi in kpis" class="kpi-card">',
        '    <div class="panel panel-default">',
        '      <div class="panel-heading">',
        '        <span class="kpi-label">{{kpi.label}}</span>',
        '      </div>',
        '      <div class="panel-body">',
        '        <div class="kpi-value">{{kpi.value}}</div>',
        '        <div class="kpi-unit">{{kpi.unit}}</div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')
    };
  }

  angular.module('davms.spendDashboard')
    .directive('summaryKpiCards', summaryKpiCards);
})();
