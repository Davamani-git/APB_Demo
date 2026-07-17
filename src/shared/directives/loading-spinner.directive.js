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
      template: [
        '<div class="apb-loading-overlay" ng-if="isLoading">',
        '  <div class="apb-loading-spinner panel panel-default">',
        '    <div class="panel-body text-center">',
        '      <span class="glyphicon glyphicon-refresh glyphicon-spin"></span>',
        '      <span class="apb-loading-text">Loading...</span>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')
    };
  }
})();
