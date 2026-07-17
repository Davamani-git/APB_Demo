(function () {
  'use strict';

  angular.module('app.core')
    .directive('simpleTooltip', [function () {
      return {
        restrict: 'A',
        scope: {
          simpleTooltip: '@'
        },
        link: function (scope, element) {
          element.attr('title', scope.simpleTooltip || '');
        }
      };
    }]);
}());
