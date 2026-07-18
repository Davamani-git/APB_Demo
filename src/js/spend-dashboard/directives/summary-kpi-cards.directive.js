(function() {
  'use strict';

  function summaryKpiCards() {
    return {
      restrict: 'E',
      scope: {
        kpis: '<'
      },
      template: '<div class="row kpi-cards-container">' +
        '<div class="col-sm-4" ng-repeat="kpi in kpis" ng-if="kpis && kpis.length">' +
        '<div class="panel panel-default kpi-card">' +
        '<div class="panel-heading">{{kpi.label}}</div>' +
        '<div class="panel-body">' +
        '<div class="kpi-card-value">{{kpi.value}}</div>' +
        '<div class="kpi-card-unit" ng-if="kpi.unit">{{kpi.unit}}</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-12" ng-if="!kpis || !kpis.length">' +
        '<p>No summary metrics are available for the selected month.</p>' +
        '</div>' +
        '</div>'
    };
  }

  angular.module('davms.spendDashboard')
    .directive('summaryKpiCards', summaryKpiCards);
})();
