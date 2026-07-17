(function () {
  'use strict';

  angular
    .module('rbApp')
    .directive('rbFooter', footerDirective);

  function footerDirective() {
    return {
      restrict: 'E',
      templateUrl: 'src/app/shared/components/footer/footer.html'
    };
  }
})();
