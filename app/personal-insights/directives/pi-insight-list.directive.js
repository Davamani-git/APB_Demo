'use strict';

(function () {
  function piInsightList() {
    return {
      restrict: 'E',
      scope: {
        insights: '=',
        filters: '=',
        onOpen: '&',
        onDismiss: '&'
      },
      templateUrl: 'app/personal-insights/views/pi-insight-list.html'
    };
  }

  angular
    .module('davBanking.personalInsights')
    .directive('piInsightList', piInsightList);
})();
