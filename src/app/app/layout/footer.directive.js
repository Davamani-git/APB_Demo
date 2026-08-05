(function () {
  'use strict';

  angular
    .module('ccd.layout')
    .directive('footer-bar', [function () {
      return {
        restrict: 'E',
        templateUrl: 'src/app/app/layout/footer.html',
        scope: {}
      };
    }]);
})();
