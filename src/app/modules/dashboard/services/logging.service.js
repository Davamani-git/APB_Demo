(function() {
  'use strict';

  LoggingService.$inject = ['$log'];

  function LoggingService($log) {
    this.$log = $log;
  }

  LoggingService.prototype.info = function(message, context) {
    this.$log.info(formatMessage(message, context));
  };

  LoggingService.prototype.warn = function(message, context) {
    this.$log.warn(formatMessage(message, context));
  };

  LoggingService.prototype.error = function(message, context) {
    this.$log.error(formatMessage(message, context));
  };

  function formatMessage(message, context) {
    var result = message || '';
    if (context && typeof context === 'object') {
      var safeContext = {};
      Object.keys(context).forEach(function(key) {
        if (key === 'token' || key === 'pan' || key === 'cvv' || key === 'accountNumber') {
          return;
        }
        safeContext[key] = context[key];
      });
      result += ' | context: ' + JSON.stringify(safeContext);
    }
    return result;
  }

  angular.module('app')
    .service('LoggingService', LoggingService);
})();
