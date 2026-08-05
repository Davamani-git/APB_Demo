(function () {
  'use strict';

  angular
    .module('timerApp')
    .service('StorageService', StorageService);

  StorageService.$inject = ['$window'];

  function StorageService($window) {
    var KEY = 'timerState';

    this.saveTimerState = function (state) {
      try {
        var serialized = JSON.stringify(state || {});
        $window.sessionStorage.setItem(KEY, serialized);
      } catch (e) {
      }
    };

    this.loadTimerState = function () {
      try {
        var raw = $window.sessionStorage.getItem(KEY);
        if (!raw) {
          return null;
        }
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
          return null;
        }
        if (parsed.state !== 'idle' && parsed.state !== 'running' && parsed.state !== 'paused') {
          return null;
        }
        if (typeof parsed.elapsedMs !== 'number' || parsed.elapsedMs < 0) {
          return null;
        }
        if (parsed.startTimestamp != null && typeof parsed.startTimestamp !== 'number') {
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    };

    this.clearTimerState = function () {
      try {
        $window.sessionStorage.removeItem(KEY);
      } catch (e) {
      }
    };
  }
})();
