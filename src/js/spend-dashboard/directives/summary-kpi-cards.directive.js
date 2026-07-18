(function() {
  'use strict';

  function summaryKpiCards() {
    return {
      restrict: 'E',
      scope: {
        kpis: '='
      },
      template: '\n        <div class="row kpi-cards-container">\n          <div class="col-sm-4" ng-repeat="kpi in kpis" ng-if="kpis && kpis.length">\n            <div class="panel panel-default kpi-card">\n              <div class="panel-heading">{{kpi.label}}</div>\n              <div class="panel-body">\n                <div class="kpi-value">{{kpi.value}}</div>\n                <div class="kpi-unit" ng-if="kpi.unit">{{kpi.unit}}</div>\n                <p class="kpi-description" ng-if="kpi.description">{{kpi.description}}</p>\n              </div>\n            </div>\n          </div>\n          <div class="col-xs-12" ng-if="!kpis || !kpis.length">\n            <div class="alert alert-info">\n              No activity for the selected month. KPIs are not applicable.\n            </div>\n          </div>\n        </div>\n      '
    };
  }

  angular.module('davms.spendDashboard')
    .directive('summaryKpiCards', summaryKpiCards);
})();
