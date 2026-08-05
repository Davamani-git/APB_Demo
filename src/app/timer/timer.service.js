(function () {
  'use strict';

  angular
    .module('timerModule')
    .service('TimerService', TimerService);

  TimerService.$inject = ['$interval', '$rootScope', 'TimerStateGuard', 'AuditLoggerService', 'StorageService', 'ENV_CONFIG'];

  function TimerService($interval, $rootScope, TimerStateGuard, AuditLoggerService, StorageService, ENV_CONFIG) {
    var TICK_MS = 1000;

    var state = 'idle';
    var intervalPromise = null;
    var startTimestamp = null;
    var elapsedMs = 0;
    var onTickHandlers = [];

    initializeFromStorage();

    var service = {
      start: start,
      pause: pause,
      stop: stop,
      getState: getState,
      getDisplayTime: getDisplayTime,
      subscribe: subscribe
    };

    return service;

    function start() {
      if (!TimerStateGuard.canStart(state)) {
        return;
      }

      try {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }

        var now = Date.now();
        startTimestamp = now;
        state = 'running';

        intervalPromise = $interval(onTick, TICK_MS);

        onTick();
        logEvent('timer:start');
      } catch (err) {
        handleError('TimerService.start', err);
      }
    }

    function pause() {
      if (!TimerStateGuard.canPause(state)) {
        return;
      }

      try {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
        if (startTimestamp) {
          elapsedMs += Date.now() - startTimestamp;
        }
        startTimestamp = null;
        state = 'paused';
        notifyTick();
        logEvent('timer:pause');
      } catch (err) {
        handleError('TimerService.pause', err);
      }
    }

    function stop() {
      if (!TimerStateGuard.canStop(state)) {
        return;
      }

      try {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
        state = 'idle';
        elapsedMs = 0;
        startTimestamp = null;
        notifyTick();
        clearStoredState();
        logEvent('timer:stop');
      } catch (err) {
        handleError('TimerService.stop', err);
      }
    }

    function onTick() {
      try {
        var now = Date.now();
        var currentElapsedMs = elapsedMs;
        if (state === 'running' && startTimestamp) {
          currentElapsedMs += now - startTimestamp;
        }
        notifyTick(currentElapsedMs);
      } catch (err) {
        handleError('TimerService.onTick', err);
      }
    }

    function notifyTick(currentMs) {
      var effectiveMs = typeof currentMs === 'number' ? currentMs : elapsedMs;
      if (state !== 'running') {
        elapsedMs = effectiveMs;
      }
      var displayTime = formatTime(effectiveMs);
      var snapshot = {
        state: state,
        elapsedMs: effectiveMs,
        startTimestamp: startTimestamp
      };
      if (ENV_CONFIG && ENV_CONFIG.enableStorage) {
        saveState(snapshot);
      }
      for (var i = 0; i < onTickHandlers.length; i++) {
        try {
          onTickHandlers[i](displayTime, state);
        } catch (e) {
        }
      }
      $rootScope.$broadcast('timer:tick', {
        displayTime: displayTime,
        state: state
      });
    }

    function getState() {
      return state;
    }

    function getDisplayTime() {
      return formatTime(elapsedMs);
    }

    function subscribe(handler) {
      if (typeof handler === 'function') {
        onTickHandlers.push(handler);
      }
    }

    function formatTime(ms) {
      var totalSeconds = Math.floor(ms / 1000);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      return [hours, minutes, seconds]
        .map(function (v) {
          var str = String(v);
          return str.length === 1 ? '0' + str : str;
        })
        .join(':');
    }

    function logEvent(name) {
      AuditLoggerService.logEvent(name, {
        state: state
      });
    }

    function handleError(context, err) {
      try {
        AuditLoggerService.logError(context, err);
      } catch (e) {
      }
      try {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
        state = 'idle';
        elapsedMs = 0;
        startTimestamp = null;
        notifyTick();
      } catch (ignored) {
      }
    }

    function initializeFromStorage() {
      try {
        if (!ENV_CONFIG || !ENV_CONFIG.enableStorage) {
          return;
        }
        var stored = StorageService.loadTimerState();
        if (!stored) {
          resetDefaults();
          return;
        }
        if (stored.state !== 'idle' && stored.state !== 'running' && stored.state !== 'paused') {
          clearStoredState();
          resetDefaults();
          return;
        }
        state = stored.state;
        elapsedMs = typeof stored.elapsedMs === 'number' && stored.elapsedMs >= 0 ? stored.elapsedMs : 0;
        startTimestamp = stored.startTimestamp != null ? stored.startTimestamp : null;
        if (state === 'running') {
          var now = Date.now();
          if (!startTimestamp || startTimestamp > now) {
            state = 'idle';
            elapsedMs = 0;
            startTimestamp = null;
            clearStoredState();
          } else {
            intervalPromise = $interval(onTick, TICK_MS);
          }
        }
      } catch (e) {
        resetDefaults();
        clearStoredState();
      }
    }

    function saveState(snapshot) {
      try {
        StorageService.saveTimerState(snapshot);
      } catch (e) {
      }
    }

    function clearStoredState() {
      try {
        StorageService.clearTimerState();
      } catch (e) {
      }
    }

    function resetDefaults() {
      state = 'idle';
      elapsedMs = 0;
      startTimestamp = null;
    }
  }
})();
