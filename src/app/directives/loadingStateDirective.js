(function () {
  'use strict';

  function loadingState() {
    return {
      restrict: 'E',
      scope: {
        loading: '=',
        message: '@'
      },
      templateUrl: 'templates/directives/loading-state.html'
    };
  }

  angular.module('app')
    .directive('loadingState', loadingState);
})();
