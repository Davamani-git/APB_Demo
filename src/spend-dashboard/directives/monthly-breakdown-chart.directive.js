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
      template: [
        '<div class="panel panel-default" ng-if="breakdown && breakdown.length">',
        '  <div class="panel-heading">Spending Breakdown</div>',
        '  <ul class="list-group">',
        '    <li class="list-group-item" ng-repeat="item in breakdown">',
        '      <div class="clearfix">',
        '        <span class="pull-left">{{item.label}}</span>',
        '        <span class="pull-right">{{item.amount | number:2}} ({{item.percentage | number:1}}%)</span>',
        '      </div>',
        '      <div class="progress">',
        '        <div class="progress-bar" role="progressbar" aria-valuenow="{{item.percentage}}" aria-valuemin="0" aria-valuemax="100" style="width: {{item.percentage}}%">',
        '          <span class="sr-only">{{item.percentage | number:1}}%</span>',
        '        </div>',
        '      </div>',
        '    </li>',
        '  </ul>',
        '</div>',
        '<div class="alert alert-info" ng-if="!breakdown || !breakdown.length">',
        '  No breakdown data available for this month.',
        '</div>'
      ].join('')
    };
  }
})();
