'use strict';

(function () {
  function idPolicyGuard(InsightDeliveryPolicyService) {
    'ngInject';
    return {
      restrict: 'A',
      scope: {
        insight: '=idPolicyGuard'
      },
      link: function (scope, element) {
        function applyPolicy() {
          var viewable = InsightDeliveryPolicyService.isInsightViewable(scope.insight);
          if (viewable) {
            element.removeClass('id-blocked');
          } else {
            element.addClass('id-blocked');
          }
        }

        scope.$watch('insight', applyPolicy, true);
      }
    };
  }

  angular
    .module('davBanking.insightDelivery')
    .directive('idPolicyGuard', idPolicyGuard);
})();
