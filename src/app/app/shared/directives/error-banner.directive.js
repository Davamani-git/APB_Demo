(function () {
  'use strict';

  angular
    .module('ccd.shared')
    .directive('errorBanner', [function () {
      return {
        restrict: 'E',
        scope: {
          error: '=',
          onRetry: '&'
        },
        template: '<div class="alert alert-danger" ng-if="error"><span ng-bind="error.message"></span> <button type="button" class="btn btn-link" ng-click="onRetry()">Retry</button></div>'
      };
    }]);
})();
