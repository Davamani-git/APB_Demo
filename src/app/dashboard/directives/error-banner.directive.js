(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .directive('ccdErrorBanner', ccdErrorBanner);

  function ccdErrorBanner() {
    return {
      restrict: 'E',
      scope: {
        message: '@'
      },
      templateUrl: 'src/app/dashboard/views/partials/error-banner.html'
    };
  }
})();
