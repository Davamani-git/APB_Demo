(function () {
  'use strict';

  angular
    .module('ccd.layout')
    .directive('navbar', [function () {
      return {
        restrict: 'E',
        templateUrl: 'src/app/app/layout/navbar.html',
        scope: {},
        controllerAs: 'vm',
        controller: [
          '$location',
          function ($location) {
            var vm = this;
            vm.isActive = function (path) {
              return $location.path() === path;
            };
          }
        ]
      };
    }]);
})();
