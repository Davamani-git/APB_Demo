(function () {
  'use strict';

  angular.module('app.core')
    .directive('loadingSpinner', [function () {
      return {
        restrict: 'E',
        template: '\n<div class="loading-overlay">\n  <div class="spinner">\n    <div class="double-bounce1"></div>\n    <div class="double-bounce2"></div>\n  </div>\n</div>\n'
      };
    }]);
}());
