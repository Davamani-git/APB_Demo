(function () {
  'use strict';

  angular
    .module('timerModule')
    .directive('timerDisplay', timerDisplay);

  timerDisplay.$inject = [];

  function timerDisplay() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: true,
      controller: 'TimerController',
      controllerAs: 'vm',
      templateUrl: 'src/app/timer/timer-display.tpl.html'
    };
  }
})();
