'use strict';

(function () {
  function rcConfirmDismissBar(RecommendationFeedbackService) {
    'ngInject';
    return {
      restrict: 'E',
      scope: {
        recommendation: '=',
        context: '='
      },
      templateUrl: 'app/recommendation-control/views/rc-confirm-dismiss-bar.html',
      link: function (scope) {
        scope.state = {
          busy: false,
          confirmed: false,
          dismissed: false
        };

        scope.confirm = function () {
          if (scope.state.busy || !scope.recommendation) { return; }
          scope.state.busy = true;
          RecommendationFeedbackService.confirm(scope.recommendation, scope.context)
            .then(function () {
              scope.state.confirmed = true;
              scope.state.dismissed = false;
            })
            .finally(function () {
              scope.state.busy = false;
            });
        };

        scope.dismiss = function () {
          if (scope.state.busy || !scope.recommendation) { return; }
          scope.state.busy = true;
          RecommendationFeedbackService.dismiss(scope.recommendation, 'USER_DISMISS', scope.context)
            .then(function () {
              scope.state.dismissed = true;
              scope.state.confirmed = false;
            })
            .finally(function () {
              scope.state.busy = false;
            });
        };
      }
    };
  }

  angular
    .module('davBanking.recommendationControl')
    .directive('rcConfirmDismissBar', rcConfirmDismissBar);
})();
