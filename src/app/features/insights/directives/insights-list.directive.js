(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .directive('insightsList', insightsListDirective);

  function insightsListDirective() {
    return {
      restrict: 'E',
      scope: {
        insights: '=',
        onSelect: '&'
      },
      template: '\n        <div class="insights-list">\n          <div ng-if="!insights || !insights.length" class="alert alert-info">\n            No insights available for the selected period.\n          </div>\n          <div class="row" ng-if="insights && insights.length">\n            <div class="col-sm-6" ng-repeat="insight in insights">\n              <rb-insight-card insight="insight" on-select="handleSelect(insight)"></rb-insight-card>\n            </div>\n          </div>\n        </div>\n      ',
      link: function (scope) {
        scope.handleSelect = function (insight) {
          scope.onSelect({ insight: insight });
        };
      }
    };
  }
})();
