'use strict';

(function () {
  function piInsightSkeleton() {
    return {
      restrict: 'E',
      templateUrl: 'app/personal-insights/views/pi-insight-skeleton.html'
    };
  }

  angular
    .module('davBanking.personalInsights')
    .directive('piInsightSkeleton', piInsightSkeleton);
})();
