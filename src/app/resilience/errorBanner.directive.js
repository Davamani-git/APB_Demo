(function() {
  'use strict';
  angular
    .module('execDashboard.resilience')
    .directive('errorBanner', errorBanner);

  function errorBanner() {
    return {
      restrict: 'E',
      controller: 'ErrorBannerController',
      controllerAs: 'errorVm',
      templateUrl: 'src/app/resilience/views/error-banner.html'
    };
  }
})();
