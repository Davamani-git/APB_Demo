'use strict';

(function () {
  function piInsightCard() {
    return {
      restrict: 'E',
      scope: {
        insight: '=',
        onOpen: '&',
        onDismiss: '&'
      },
      templateUrl: 'app/personal-insights/views/pi-insight-card.html'
    };
  }

  angular
    .module('davBanking.personalInsights')
    .directive('piInsightCard', piInsightCard);
})();
