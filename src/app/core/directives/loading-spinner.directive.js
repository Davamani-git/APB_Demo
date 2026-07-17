(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .directive('rbLoadingSpinner', loadingSpinnerDirective);

  function loadingSpinnerDirective() {
    return {
      restrict: 'E',
      template: '<div class="rb-loading-spinner text-center"><span class="spinner-border" aria-hidden="true"></span><span class="sr-only">Loading...</span></div>'
    };
  }
})();
