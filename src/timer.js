(function () {
  'use strict';

  /**
   * @typedef {('stopped' | 'running' | 'paused')} TimerStatus
   */

  /**
   * @typedef {Object} TimerState
   * @property {TimerStatus} status
   * @property {number} startTimeMs
   * @property {number} elapsedBeforeRunMs
   * @property {number} lastTickTimeMs
   * @property {number} currentElapsedMs
   * @property {number | null} intervalId
   */

  /**
   * @typedef {Object} TimerLogEntry
   * @property {string} type
   * @property {string} timestampIso
   * @property {string} status
   * @property {string} [message]
   */

  const ElapsedTimeManager = {
    nowMs() {
      if (window.performance && typeof window.performance.now === 'function') {
        return window.performance.now();
      }
      return Date.now();
    },

    /**
     * @param {TimerState} state
     * @returns {number}
     */
    getElapsedMs(state) {
      if (state.status === 'running') {
        return state.elapsedBeforeRunMs + (this.nowMs() - state.startTimeMs);
      }
      return state.currentElapsedMs;
    },

    /**
     * @param {number} elapsedMs
     * @returns {string}
     */
    formatElapsed(elapsedMs) {
      const totalSeconds = Math.floor(elapsedMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n) => String(n).padStart(2, '0');
      return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    },
  };

  const RulesEngine = {
    /**
     * @param {TimerState} state
     * @returns {boolean}
     */
    canStart(state) {
      return state.status === 'stopped' || state.status === 'paused';
    },

    /**
     * @param {TimerState} state
     * @returns {boolean}
     */
    canPause(state) {
      return state.status === 'running';
    },

    /**
     * @param {TimerState} state
     * @returns {boolean}
     */
    canStop(state) {
      return state.status === 'running' || state.status === 'paused';
    },
  };

  const SecurityLogger = {
    /** @type {TimerLogEntry[]} */
    logEntries: [],

    /**
     * @param {string} type
     * @param {string} status
     * @param {string} [message]
     */
    logEvent(type, status, message) {
      const entry = {
        type: type,
        status: status,
        timestampIso: new Date().toISOString(),
      };
      if (message) {
        entry.message = message;
      }
      this.logEntries.push(entry);
    },

    /**
     * @param {string} message
     * @param {string} [statusOverride]
     */
    logWarning(message, statusOverride) {
      this.logEvent('warning', statusOverride || 'unknown', message);
    },

    /**
     * @param {any} error
     * @param {string} [statusOverride]
     */
    logError(error, statusOverride) {
      var msg = error && error.message ? error.message : String(error);
      this.logEvent('error', statusOverride || 'unknown', msg);
    },
  };

  const TimerController = {
    /** @type {TimerState} */
    state: {
      status: 'stopped',
      startTimeMs: 0,
      elapsedBeforeRunMs: 0,
      lastTickTimeMs: 0,
      currentElapsedMs: 0,
      intervalId: null,
    },

    displayEl: null,
    btnStart: null,
    btnPause: null,
    btnStop: null,

    init: function () {
      this.displayEl = document.getElementById('timer-display');
      this.btnStart = document.getElementById('btn-start');
      this.btnPause = document.getElementById('btn-pause');
      this.btnStop = document.getElementById('btn-stop');

      if (!this.displayEl || !this.btnStart || !this.btnPause || !this.btnStop) {
        SecurityLogger.logError('Timer UI elements not found', this.state.status);
        return;
      }

      this.displayEl.textContent = '00:00:00';
      this.updateControls();

      var self = this;

      this.btnStart.addEventListener('click', function () {
        self.safeHandle(function () {
          self.handleStartClick();
        });
      });

      this.btnPause.addEventListener('click', function () {
        self.safeHandle(function () {
          self.handlePauseClick();
        });
      });

      this.btnStop.addEventListener('click', function () {
        self.safeHandle(function () {
          self.handleStopClick();
        });
      });
    },

    /**
     * @param {Function} fn
     */
    safeHandle: function (fn) {
      try {
        fn();
      } catch (err) {
        SecurityLogger.logError(err, this.state.status);
      }
    },

    handleStartClick: function () {
      if (!RulesEngine.canStart(this.state)) {
        SecurityLogger.logWarning('Start clicked in invalid state: ' + this.state.status, this.state.status);
        return;
      }
      var previousStatus = this.state.status;
      this.startTimer(previousStatus === 'paused');
    },

    handlePauseClick: function () {
      if (!RulesEngine.canPause(this.state)) {
        SecurityLogger.logWarning('Pause clicked in invalid state: ' + this.state.status, this.state.status);
        return;
      }
      this.pauseTimer();
    },

    handleStopClick: function () {
      if (!RulesEngine.canStop(this.state)) {
        SecurityLogger.logWarning('Stop clicked in invalid state: ' + this.state.status, this.state.status);
        return;
      }
      this.stopTimer();
    },

    /**
     * @param {boolean} isResume
     */
    startTimer: function (isResume) {
      if (this.state.status === 'stopped') {
        this.state.elapsedBeforeRunMs = 0;
        this.state.currentElapsedMs = 0;
      }
      this.state.startTimeMs = ElapsedTimeManager.nowMs();
      this.state.status = 'running';

      this.startUpdateLoop();
      this.updateControls();

      SecurityLogger.logEvent(isResume ? 'resume' : 'start', this.state.status);
    },

    pauseTimer: function () {
      var elapsed = ElapsedTimeManager.getElapsedMs(this.state);
      this.state.elapsedBeforeRunMs = elapsed;
      this.state.currentElapsedMs = elapsed;
      this.state.status = 'paused';

      this.stopUpdateLoop();
      this.updateDisplay();
      this.updateControls();

      SecurityLogger.logEvent('pause', this.state.status);
    },

    stopTimer: function () {
      this.stopUpdateLoop();
      this.state.status = 'stopped';
      this.state.elapsedBeforeRunMs = 0;
      this.state.currentElapsedMs = 0;
      this.state.startTimeMs = 0;

      this.updateDisplay();
      this.updateControls();

      SecurityLogger.logEvent('stop_reset', this.state.status);
    },

    startUpdateLoop: function () {
      if (this.state.intervalId != null) {
        clearInterval(this.state.intervalId);
      }
      var self = this;
      var INTERVAL_MS = 200;
      this.state.intervalId = window.setInterval(function () {
        self.onTick();
      }, INTERVAL_MS);
    },

    stopUpdateLoop: function () {
      if (this.state.intervalId != null) {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
      }
    },

    onTick: function () {
      if (this.state.status !== 'running') {
        return;
      }
      var elapsed = ElapsedTimeManager.getElapsedMs(this.state);
      this.state.currentElapsedMs = elapsed;
      this.updateDisplay();
    },

    updateDisplay: function () {
      if (!this.displayEl) return;
      var elapsed = this.state.currentElapsedMs;
      var formatted = ElapsedTimeManager.formatElapsed(elapsed);
      this.displayEl.textContent = formatted;
    },

    updateControls: function () {
      if (!this.btnStart || !this.btnPause || !this.btnStop) return;

      var status = this.state.status;

      if (status === 'stopped') {
        this.btnStart.disabled = false;
        this.btnPause.disabled = true;
        this.btnStop.disabled = true;
      } else if (status === 'running') {
        this.btnStart.disabled = true;
        this.btnPause.disabled = false;
        this.btnStop.disabled = false;
      } else if (status === 'paused') {
        this.btnStart.disabled = false;
        this.btnPause.disabled = true;
        this.btnStop.disabled = false;
      }
    },
  };

  document.addEventListener('DOMContentLoaded', function () {
    TimerController.init();
  });
})();
