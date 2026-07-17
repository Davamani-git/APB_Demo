'use strict';

(function () {
  function piConsentBanner() {
    return {
      restrict: 'E',
      scope: {
        onManagePreferences: '&'
      },
      templateUrl: 'app/personal-insights/views/pi-consent-banner.html'
    };
  }

  angular
    .module('davBanking.personalInsights')
    .directive('piConsentBanner', piConsentBanner);
})();
