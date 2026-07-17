'use strict';

(function () {
  function idBlockedBanner() {
    return {
      restrict: 'E',
      scope: {
        reasonCode: '@',
        jurisdiction: '@'
      },
      templateUrl: 'app/insight-delivery/views/blocked-insight-banner.html'
    };
  }

  angular
    .module('davBanking.insightDelivery')
    .directive('idBlockedBanner', idBlockedBanner);
})();
