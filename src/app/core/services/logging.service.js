(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['ENV_CONFIG'];
  function LoggingService(ENV_CONFIG) {
    var level = ENV_CONFIG.loggingLevel || 'INFO';

    this.info = function(message, context) {
      if (level === 'INFO' || level === 'DEBUG') {
        console.info('[INFO]', message, context || '');
      }
    };

    this.warn = function(message, context) {
      if (level === 'INFO' || level === 'DEBUG') {
        console.warn('[WARN]', message, context || '');
      }
    };

    this.error = function(message, context) {
      console.error('[ERROR]', message, context || '');
    };

    this.debug = function(message, context) {
      if (level === 'DEBUG') {
        console.log('[DEBUG]', message, context || '');
      }
    };
  }
})();
