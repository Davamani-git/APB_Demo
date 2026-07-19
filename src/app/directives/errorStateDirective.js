(function () {
  'use strict';

  function errorState() {
    return {
      restrict: 'E',
      scope: {
        error: '=',
        onRetry: '&'
      },
      templateUrl: 'templates/directives/error-state.html'
    };
  }

  angular.module('app')
    .directive('errorState', errorState);
})();
