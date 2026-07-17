(function () {
  'use strict';

  angular
    .module('rbApp')
    .directive('rbNavbar', navbarDirective);

  function navbarDirective() {
    return {
      restrict: 'E',
      templateUrl: 'src/app/shared/components/navbar/navbar.html'
    };
  }
})();
