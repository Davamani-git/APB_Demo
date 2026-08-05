(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .directive('progressBar', progressBar);

  function progressBar() {
    return {
      restrict: 'E',
      scope: {
        value: '=',
        label: '@'
      },
      templateUrl: 'src/app/shared/directives/views/progress-bar.html'
    };
  }
})();
