'use strict';

(function () {
  function crRecommendationTile() {
    return {
      restrict: 'E',
      scope: {
        recommendation: '=',
        onConfirm: '&',
        onDismiss: '&',
        onViewDetails: '&'
      },
      templateUrl: 'app/context-recommendations/views/cr-recommendation-tile.html'
    };
  }

  angular
    .module('davBanking.contextRecommendations')
    .directive('crRecommendationTile', crRecommendationTile);
})();
