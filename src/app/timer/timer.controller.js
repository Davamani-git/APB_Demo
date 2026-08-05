(function () {
  'use strict';

  angular
    .module('timerModule')
    .controller('TimerController', TimerController);

  TimerController.$inject = ['TimerService', 'TimerStateGuard', 'AuditLoggerService'];

  function TimerController(TimerService, TimerStateGuard, AuditLoggerService) {
    var vm = this;

    vm.displayTime = TimerService.getDisplayTime();
    vm.state = TimerService.getState();

    vm.canStart = TimerStateGuard.canStart(vm.state);
    vm.canPause = TimerStateGuard.canPause(vm.state);
    vm.canStop = TimerStateGuard.canStop(vm.state);

    vm.start = start;
    vm.pause = pause;
    vm.stop = stop;

    TimerService.subscribe(function (displayTime, state) {
      vm.displayTime = displayTime;
      vm.state = state;
      vm.canStart = TimerStateGuard.canStart(vm.state);
      vm.canPause = TimerStateGuard.canPause(vm.state);
      vm.canStop = TimerStateGuard.canStop(vm.state);
    });

    function start() {
      TimerService.start();
      AuditLoggerService.logEvent('timer:start', {
        state: TimerService.getState()
      });
    }

    function pause() {
      TimerService.pause();
      AuditLoggerService.logEvent('timer:pause', {
        state: TimerService.getState()
      });
    }

    function stop() {
      TimerService.stop();
      AuditLoggerService.logEvent('timer:stop', {
        state: TimerService.getState()
      });
    }
  }
})();
