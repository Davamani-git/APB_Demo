(function () {
  'use strict';

  angular
    .module('timerApp')
    .service('AuditLoggerService', AuditLoggerService);

  AuditLoggerService.$inject = ['$log'];

  function AuditLoggerService($log) {
    var buffer = [];

    this.logEvent = function (eventName, details) {
      if (!eventName) {
        return;
      }
      var entry = {
        ts: new Date().toISOString(),
        eventName: eventName,
        details: sanitizeDetails(details)
      };
      buffer.push(entry);
      $log.info('[EVENT]', entry);
    };

    this.logError = function (context, error) {
      var safeMessage = (error && error.message) ? String(error.message) : 'Error';
      var entry = {
        ts: new Date().toISOString(),
        context: context,
        error: safeMessage
      };
      buffer.push(entry);
      $log.error('[ERROR]', entry);
    };

    this.getBuffer = function () {
      return buffer.slice();
    };

    function sanitizeDetails(details) {
      if (!details) {
        return {};
      }
      var clone;
      try {
        clone = JSON.parse(JSON.stringify(details));
      } catch (e) {
        return {};
      }
      if (clone.password) {
        delete clone.password;
      }
      if (clone.token) {
        delete clone.token;
      }
      if (clone.secret) {
        delete clone.secret;
      }
      if (clone.ssn) {
        delete clone.ssn;
      }
      return clone;
    }
  }
})();
