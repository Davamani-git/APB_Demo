(function () {
  'use strict';

  angular
    .module('timerModule')
    .service('TimerStateGuard', TimerStateGuard);

  TimerStateGuard.$inject = [];

  function TimerStateGuard() {
    this.canStart = function (state) {
      return state === 'idle' || state === 'paused';
    };

    this.canPause = function (state) {
      return state === 'running';
    };

    this.canStop = function (state) {
      return state === 'running' || state === 'paused';
    };
  }
})();
