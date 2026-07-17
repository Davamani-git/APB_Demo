(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .factory('ReminderPreferencesModel', ReminderPreferencesModelFactory);

  function ReminderPreferencesModelFactory() {
    class ReminderPreferencesModel {
      constructor(dto) {
        dto = dto || {};
        this.channels = dto.channels || { APP: true, EMAIL: true, SMS: false, PUSH: false };
        this.leadTimeDays = typeof dto.leadTimeDays === 'number' ? dto.leadTimeDays : 3;
        this.timezone = dto.timezone || 'UTC';
        this.consent = dto.consent || { email: true, sms: false };
      }

      isLeadTimeValid() {
        return this.leadTimeDays >= 0 && this.leadTimeDays <= 30;
      }
    }

    return ReminderPreferencesModel;
  }
})();
