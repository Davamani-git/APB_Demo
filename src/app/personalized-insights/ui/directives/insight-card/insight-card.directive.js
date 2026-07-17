'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.ui')
    .directive('insightCard', insightCard);

  function insightCard() {
    return {
      restrict: 'E',
      scope: {
        insight: '<',
        onAction: '&'
      },
      templateUrl: 'src/app/personalized-insights/ui/directives/insight-card/insight-card.template.html',
      link: function (scope) {
        scope.handleAction = function (action) {
          if (scope.onAction) {
            scope.onAction({ insight: scope.insight, action: action });
          }
        };
      }
    };
  }
})();
