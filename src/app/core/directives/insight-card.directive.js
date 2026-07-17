(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .directive('rbInsightCard', insightCardDirective);

  function insightCardDirective() {
    return {
      restrict: 'E',
      scope: {
        insight: '=',
        onSelect: '&'
      },
      template: '\n        <div class="insight-card" ng-click="handleSelect()">\n          <h4 class="insight-title">{{insight.title}}</h4>\n          <p class="insight-summary">{{insight.summary}}</p>\n          <p class="insight-meta">\n            <span class="label label-default">{{insight.category | categoryLabel}}</span>\n            <span class="insight-time">{{{from: insight.timeWindow.from, to: insight.timeWindow.to} | dateRange}}</span>\n          </p>\n        </div>\n      ',
      link: function (scope) {
        scope.handleSelect = function () {
          if (scope.onSelect) {
            scope.onSelect({ insight: scope.insight });
          }
        };
      }
    };
  }
})();
