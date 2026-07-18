(function() {
  'use strict';

  summaryKpiCards.$inject = [];

  function summaryKpiCards() {
    return {
      restrict: 'E',
      scope: {
        kpis: '='
      },
      template: [
        '<div class="kpi-cards-container">',
        '  <div class="row">',
        '    <div class="col-md-4 col-sm-6" ng-repeat="kpi in kpis">',
        '      <div class="kpi-card">',
        '        <div class="kpi-card-label">{{ kpi.label }}</div>',
        '        <div class="kpi-card-value">{{ kpi.value }}</div>',
        '        <div class="kpi-card-unit" ng-if="kpi.unit and kpi.label !== \'Total Spend\' and kpi.label !== \'Average Transaction\'">{{ kpi.unit }}</div>',
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