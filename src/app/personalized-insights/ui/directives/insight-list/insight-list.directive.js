'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.ui')
    .directive('insightList', insightList);

  function insightList() {
    return {
      restrict: 'E',
      scope: {
        insights: '<',
        onAction: '&'
      },
      templateUrl: 'src/app/personalized-insights/ui/directives/insight-list/insight-list.template.html'
    };
  }
})();
