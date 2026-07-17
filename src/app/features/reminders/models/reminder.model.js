(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .factory('ReminderModel', ReminderModelFactory);

  function ReminderModelFactory() {
    class ReminderModel {
      constructor(dto) {
        dto = dto || {};
        this.id = dto.id || '';
        this.merchantName = dto.merchantName || '';
        this.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
        this.amount = typeof dto.amount === 'number' ? dto.amount : 0;
        this.currency = dto.currency || '';
        this.status = dto.status || 'PENDING';
        this.source = dto.source || 'DETECTED';
        this.channels = Array.isArray(dto.channels) ? dto.channels : [];
        this.leadTimeDays = typeof dto.leadTimeDays === 'number' ? dto.leadTimeDays : 0;
        this.createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
      }

      isValid() {
        if (!this.id || !this.dueDate) {
          return false;
        }
        if (this.amount < 0) {
          return false;
        }
        return true;
      }
    }

    return ReminderModel;
  }
})();
