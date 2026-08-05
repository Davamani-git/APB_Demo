(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .directive('statusBadge', statusBadge);

  function statusBadge() {
    return {
      restrict: 'E',
      scope: {
        status: '@'
      },
      templateUrl: 'src/app/shared/directives/views/status-badge.html'
    };
  }
})();
