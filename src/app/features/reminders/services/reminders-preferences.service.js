(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .service('RemindersPreferencesService', RemindersPreferencesService);

  RemindersPreferencesService.$inject = ['ApiGatewayService', 'ErrorHandlerService'];

  function RemindersPreferencesService(ApiGatewayService, ErrorHandlerService) {
    this.getPreferences = function () {
      return ApiGatewayService.get('REMINDERS', '/preferences');
    };

    this.updatePreferences = function (preferences) {
      return ApiGatewayService.put('REMINDERS', '/preferences', preferences)
        .catch(function (error) {
          const standardError = ErrorHandlerService.handleClientError(error);
          throw standardError;
        });
    };
  }
})();
