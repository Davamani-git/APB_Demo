(function() {
  'use strict';
  angular.module('app.insights')
    .directive('insightCard', ['InsightsService', function(InsightsService) {
      return {
        restrict: 'E',
        scope: {
          insight: '=',
          onExplain: '&',
          onFeedback: '&'
        },
        template: '<div class="insight-card" ng-class="getConfidenceClass()">' +
          '<h4>{{insight.title}}</h4>' +
          '<p>{{insight.description}}</p>' +
          '<p><small>Confidence: {{insight.confidence}}%</small></p>' +
          '<button class="btn btn-sm btn-info" ng-click="onExplain({insightId: insight.id})">Explain</button> ' +
          '<insight-feedback insight="insight" on-feedback="onFeedback({insightId: insightId, feedback: feedback})"></insight-feedback>' +
          '<div ng-if="insight.showExplanation" class="well" style="margin-top: 10px;">' +
          '<strong>Detailed Explanation:</strong>' +
          '<p>{{insight.detailedExplanation}}</p>' +
          '</div>' +
          '</div>',
        link: function(scope) {
          scope.getConfidenceClass = function() {
            if (!scope.insight) return '';
            if (scope.insight.confidence >= 80) return 'high-confidence';
            if (scope.insight.confidence >= 50) return 'medium-confidence';
            return 'low-confidence';
          };
        }
      };
    }]);
})();