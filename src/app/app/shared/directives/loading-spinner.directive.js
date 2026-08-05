(function () {
  'use strict';

  angular
    .module('ccd.shared')
    .directive('loadingSpinner', [function () {
      return {
        restrict: 'E',
        scope: {
          isBusy: '='
        },
        template: '<div class="loading-spinner" ng-show="isBusy"><div class="spinner-backdrop"></div><div class="spinner"><span class="sr-only">Loading...</span></div></div>'
      };
    }]);
})();
