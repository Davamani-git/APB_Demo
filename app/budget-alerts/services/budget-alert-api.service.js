'use strict';

(function () {
  class BudgetAlertApiService {
    constructor($http, $q, BUDGET_ALERTS_API_BASE_URL) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.baseUrl = BUDGET_ALERTS_API_BASE_URL;
    }

    getBudgets() {
      return this.$http.get(this.baseUrl + '/budgets')
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getBudget(id) {
      return this.$http.get(this.baseUrl + '/budgets/' + encodeURIComponent(id))
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    createBudget(payload) {
      return this.$http.post(this.baseUrl + '/budgets', payload)
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    updateBudget(id, payload) {
      return this.$http.put(this.baseUrl + '/budgets/' + encodeURIComponent(id), payload)
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }

    getAlerts(params) {
      return this.$http.get(this.baseUrl + '/alerts', { params: params })
        .then(resp => resp.data)
        .catch(err => this.$q.reject(err));
    }
  }

  angular
    .module('davBanking.budgetAlerts')
    .service('BudgetAlertApiService', BudgetAlertApiService);
})();
