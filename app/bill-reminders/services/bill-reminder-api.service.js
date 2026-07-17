'use strict';

(function () {
  class BillReminderApiService {
    constructor($http, $q, BILL_REMINDERS_API_BASE_URL) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.baseUrl = BILL_REMINDERS_API_BASE_URL;
    }

    getReminders(params) {
      return this.$http.get(this.baseUrl + '/reminders', { params: params })
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    acknowledgeReminder(id) {
      return this.$http.post(this.baseUrl + '/reminders/' + encodeURIComponent(id) + '/acknowledge', {})
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    dismissReminder(id) {
      return this.$http.post(this.baseUrl + '/reminders/' + encodeURIComponent(id) + '/dismiss', {})
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getPreferences() {
      return this.$http.get(this.baseUrl + '/preferences')
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    updatePreferences(payload) {
      return this.$http.put(this.baseUrl + '/preferences', payload)
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }
  }

  angular
    .module('davBanking.billReminders')
    .service('BillReminderApiService', BillReminderApiService);
})();
