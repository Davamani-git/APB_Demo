(function () {
  'use strict';

  angular
    .module('execSummary.directives')
    .directive('themePreview', [function () {
      return {
        restrict: 'E',
        scope: {
          theme: '='
        },
        templateUrl: 'src/app/views/theme-preview.html'
      };
    }]);
})();