'use strict';

(function () {
  function crRecommendationList() {
    return {
      restrict: 'E',
      scope: {
        context: '=',
        recommendations: '=?',
        onConfirm: '&?',
        onDismiss: '&?',
        onViewDetails: '&?'
      },
      controller: 'ContextRecommendationsPanelController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/context-recommendations/views/context-recommendations-panel.html'
    };
  }

  angular
    .module('davBanking.contextRecommendations')
    .directive('crRecommendationList', crRecommendationList);
})();
