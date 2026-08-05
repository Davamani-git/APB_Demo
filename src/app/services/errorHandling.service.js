(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('ErrorHandlingService', ['LoggingService', '$rootScope', function (LoggingService, $rootScope) {
      var notifications = [];

      function pushNotification(type, text) {
        notifications.push({ type: type, text: text });
        $rootScope.$broadcast('execSummary:notificationsChanged', notifications);
      }

      this.handleStorageError = function (error, key) {
        LoggingService.error('Storage failure', { error: error, key: key });
        pushNotification('warning', 'Storage issue detected. Changes may not persist across sessions.');
        $rootScope.$broadcast('execSummary:storageInMemory');
      };

      this.handleValidationError = function (error, field) {
        LoggingService.warn('Validation error', { error: error, field: field });
      };

      this.handleUnexpectedError = function (error, cause) {
        LoggingService.error('Unexpected error', { error: error, cause: cause });
        pushNotification('error', 'An unexpected error occurred. Some functionality may be limited.');
        $rootScope.$broadcast('execSummary:error', { error: error, cause: cause });
      };

      this.getNotifications = function () {
        return notifications;
      };
    }]);
})();