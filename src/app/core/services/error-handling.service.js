(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('ErrorHandlingService', ErrorHandlingService);

  ErrorHandlingService.$inject = ['$rootScope', 'LoggingService'];
  function ErrorHandlingService($rootScope, LoggingService) {
    this.handleStorageError = function(error) {
      LoggingService.error('Storage error', error);
      $rootScope.$broadcast('error:storage', { message: 'Storage error occurred', error: error });
    };

    this.handleValidationError = function(errors) {
      LoggingService.warn('Validation errors', errors);
      $rootScope.$broadcast('error:validation', { errors: errors });
    };

    this.notifyUserFriendly = function(message, severity) {
      $rootScope.$broadcast('error:notify', { message: message, severity: severity || 'info' });
    };
  }
})();
