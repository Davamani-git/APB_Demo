'use strict';

(function () {
  class BillReminderModelService {
    constructor($log) {
      'ngInject';
      this.$log = $log;
      this._reminders = [];
    }

    setReminders(list) {
      this._reminders = (list || []).map(item => this._normalize(item));
    }

    _normalize(item) {
      if (!item) { return null; }
      var model = {
        id: item.id,
        billerName: item.billerName,
        maskedAccountId: item.maskedAccountId,
        predictedAmount: item.predictedAmount,
        currency: item.currency,
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
        leadDays: item.leadDays,
        status: item.status,
        channel: item.channel,
        isEditable: !!item.isEditable
      };
      if (!model.id) {
        this.$log.warn('Invalid BillReminderModel payload', item);
      }
      return model;
    }

    getReminders() {
      return this._reminders;
    }

    updateReminder(reminder) {
      if (!reminder || !reminder.id) { return; }
      var idx = this._reminders.findIndex(r => r.id === reminder.id);
      if (idx >= 0) {
        this._reminders[idx] = reminder;
      }
    }
  }

  angular
    .module('davBanking.billReminders')
    .service('BillReminderModelService', BillReminderModelService);
})();
