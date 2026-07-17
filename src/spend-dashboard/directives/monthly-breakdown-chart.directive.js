(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .directive('monthlyBreakdownChart', monthlyBreakdownChart);

  function monthlyBreakdownChart() {
    return {
      restrict: 'E',
      scope: {
        breakdown: '='
      },
      template: '<div class="panel panel-default" ng-if="breakdown && breakdown.length">' +
        '<div class="panel-heading">Spend Breakdown</div>' +
        '<table class="table table-striped">' +
        '<thead>' +
        '<tr>' +
        '<th>Category</th>' +
        '<th class="text-right">Amount</th>' +
        '<th class="text-right">Percentage</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr ng-repeat="b in breakdown track by $index">' +
        '<td>{{b.label}}</td>' +
        '<td class="text-right">{{b.amount | number:2}}</td>' +
        '<td class="text-right">{{b.percentage | number:1}}%</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>'
    };
  }
})();
