'use strict';

(function () {
  function crExplainabilityBadge() {
    return {
      restrict: 'E',
      scope: {
        explanation: '='
      },
      templateUrl: 'app/context-recommendations/views/cr-explainability-badge.html'
    };
  }

  angular
    .module('davBanking.contextRecommendations')
    .directive('crExplainabilityBadge', crExplainabilityBadge);
})();
