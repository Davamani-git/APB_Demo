(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .service('RemindersCalendarService', RemindersCalendarService);

  function RemindersCalendarService() {
    this.buildCalendarMonth = function (reminders, monthDate) {
      const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      const days = [];
      for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
        const dayReminders = (reminders || []).filter(function (r) {
          const due = new Date(r.dueDate);
          return due.getFullYear() === d.getFullYear() &&
            due.getMonth() === d.getMonth() &&
            due.getDate() === d.getDate();
        });
        days.push({ date: new Date(d), reminders: dayReminders });
      }
      return { firstDay: first, lastDay: last, days: days };
    };
  }
})();
