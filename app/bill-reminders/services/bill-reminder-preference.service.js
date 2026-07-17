'use strict';

(function () {
  class BillReminderPreferenceService {
    constructor(BillReminderApiService, $q, $log) {
      'ngInject';
      this.BillReminderApiService = BillReminderApiService;
      this.$q = $q;
      this.$log = $log;
      this._preferences = null;
    }

    loadPreferences() {
      var self = this;
      return this.BillReminderApiService.getPreferences()
        .then(function (data) {
          self._preferences = data;
          return data;
        })
        .catch(function (err) {
          self.$log.error('Failed to load bill reminder preferences', err);
          return self.$q.reject(err);
        });
    }

    getPreferences() {
      return this._preferences;
    }

    savePreferences(model) {
      var self = this;
      return this.BillReminderApiService.updatePreferences(model)
        .then(function (data) {
          self._preferences = data;
          return data;
        });
    }
  }

  angular
    .module('davBanking.billReminders')
    .service('BillReminderPreferenceService', BillReminderPreferenceService);
})();
