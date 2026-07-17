(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .service('RemindersService', RemindersService);

  RemindersService.$inject = ['ApiGatewayService', 'LoggingService', 'ErrorHandlerService', 'ReminderModel'];

  function RemindersService(ApiGatewayService, LoggingService, ErrorHandlerService, ReminderModel) {
    this.getUpcomingReminders = function (query) {
      const params = buildQueryParams(query);
      return ApiGatewayService.get('REMINDERS', '/reminders/upcoming', { params: params })
        .then(function (data) {
          const items = Array.isArray(data.items) ? data.items : [];
          return items.map(function (dto) { return new ReminderModel(dto); });
        })
        .catch(function (error) {
          const standardError = ErrorHandlerService.handleClientError(error);
          LoggingService.error('Failed to load upcoming reminders', { error: standardError });
          throw standardError;
        });
    };

    this.getPastReminders = function (query) {
      const params = buildQueryParams(query);
      return ApiGatewayService.get('REMINDERS', '/reminders/past', { params: params })
        .then(function (data) {
          const items = Array.isArray(data.items) ? data.items : [];
          return items.map(function (dto) { return new ReminderModel(dto); });
        })
        .catch(function (error) {
          const standardError = ErrorHandlerService.handleClientError(error);
          LoggingService.error('Failed to load past reminders', { error: standardError });
          throw standardError;
        });
    };

    this.getReminderById = function (reminderId) {
      return ApiGatewayService.get('REMINDERS', '/reminders/' + encodeURIComponent(reminderId))
        .then(function (data) { return new ReminderModel(data); });
    };

    this.dismissReminder = function (reminderId) {
      return ApiGatewayService.post('REMINDERS', '/reminders/' + encodeURIComponent(reminderId) + '/dismiss', {})
        .then(function () {
          LoggingService.info('Reminder dismissed', { reminderId: reminderId });
        });
    };

    this.markReminderHandled = function (reminderId) {
      return ApiGatewayService.post('REMINDERS', '/reminders/' + encodeURIComponent(reminderId) + '/handled', {})
        .then(function () {
          LoggingService.info('Reminder marked as handled', { reminderId: reminderId });
        });
    };

    function buildQueryParams(query) {
      query = query || {};
      const params = {};
      if (query.fromDate) {
        params.fromDate = query.fromDate.toISOString().substr(0, 10);
      }
      if (query.toDate) {
        params.toDate = query.toDate.toISOString().substr(0, 10);
      }
      if (query.status) {
        params.status = query.status;
      }
      if (query.page) {
        params.page = query.page;
      }
      if (query.pageSize) {
        params.pageSize = query.pageSize;
      }
      return params;
    }
  }
})();
