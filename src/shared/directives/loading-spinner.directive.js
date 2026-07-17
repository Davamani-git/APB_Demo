(function () {
  'use strict';

  angular
    .module('apb.shared')
    .directive('loadingSpinner', loadingSpinner);

  function loadingSpinner() {
    return {
      restrict: 'E',
      scope: {
        isLoading: '='
      },
      template: '<div class="apb-loading-overlay" ng-show="isLoading">' +
        '<div class="apb-loading-spinner panel panel-default">' +
        '<div class="panel-body text-center">' +
        '<span class="glyphicon glyphicon-refresh glyphicon-spin"></span>' +
        '<span class="sr-only">Loading...</span>' +
        '</div>' +
        '</div>' +
        '</div>'
    };
  }
})();
