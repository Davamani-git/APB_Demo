(function () {
  'use strict';

  angular.module('app.dashboard')
    .directive('errorBanner', [function () {
      return {
        restrict: 'E',
        templateUrl: 'src/app/features/dashboard/views/partials/error-state.html',
        scope: {
          error: '='
        }
      };
    }]);
}());
