(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .directive('insightsExplanation', insightsExplanationDirective);

  function insightsExplanationDirective() {
    return {
      restrict: 'E',
      scope: {
        insight: '='
      },
      template: '\n        <div class="insights-explanation" ng-if="insight">\n          <h4>How this insight was generated</h4>\n          <p>{{insight.explanation}}</p>\n          <p class="text-muted">\n            Timeframe: {{{from: insight.timeWindow.from, to: insight.timeWindow.to} | dateRange}}\n            <span ng-if="insight.createdAt"> | Generated: {{insight.createdAt | date: \'medium\'}} </span>\n          </p>\n        </div>\n      '
    };
  }
})();
