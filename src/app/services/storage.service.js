(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('StorageService', ['$window', 'LoggingService', 'ErrorHandlingService', 'ENV_CONFIG', 'FEATURE_FLAGS', function ($window, LoggingService, ErrorHandlingService, ENV_CONFIG, FEATURE_FLAGS) {
      var SCHEMA_VERSION = 1;

      this.load = function (key) {
        try {
          var raw = $window.localStorage.getItem(key);
          if (!raw) {
            return null;
          }
          var payload = JSON.parse(raw);
          if (payload.schemaVersion !== SCHEMA_VERSION) {
            LoggingService.warn('Schema version mismatch', { key: key, payload: payload });
            return null;
          }
          return payload.data;
        } catch (e) {
          ErrorHandlingService.handleStorageError(e, key);
          return null;
        }
      };

      this.save = function (key, data) {
        try {
          var payload = {
            schemaVersion: SCHEMA_VERSION,
            timestamp: new Date().toISOString(),
            data: data
          };
          $window.localStorage.setItem(key, JSON.stringify(payload));
          return true;
        } catch (e) {
          ErrorHandlingService.handleStorageError(e, key);
          return false;
        }
      };

      this.clear = function (key) {
        $window.localStorage.removeItem(key);
      };

      this.getSchemaVersion = function () {
        return SCHEMA_VERSION;
      };
    }]);
})();