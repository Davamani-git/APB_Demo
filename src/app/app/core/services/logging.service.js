(function () {
  'use strict';

  angular
    .module('ccd.core')
    .factory('loggingService', [
      '$log',
      'envConfig',
      function ($log, envConfig) {
        var level = envConfig.get('loggingLevel') || 'INFO';
        var levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        var currentIndex = levels.indexOf(level.toUpperCase());
        if (currentIndex === -1) {
          currentIndex = 1;
        }

        function shouldLog(targetLevel) {
          return levels.indexOf(targetLevel) >= currentIndex;
        }

        return {
          info: function (message, context) {
            if (shouldLog('INFO')) {
              $log.info(message, context || {});
            }
          },
          warn: function (message, context) {
            if (shouldLog('WARN')) {
              $log.warn(message, context || {});
            }
          },
          error: function (message, context, error) {
            if (shouldLog('ERROR')) {
              $log.error(message, context || {}, error || {});
            }
          },
          audit: function (eventType, payload) {
            if (shouldLog('INFO')) {
              $log.info('AUDIT ' + eventType, payload || {});
            }
          }
        };
      }
    ]);
})();
