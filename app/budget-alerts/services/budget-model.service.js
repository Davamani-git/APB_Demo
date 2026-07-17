'use strict';

(function () {
  class BudgetModelService {
    constructor($log) {
      'ngInject';
      this.$log = $log;
      this._budgets = [];
    }

    setBudgets(list) {
      this._budgets = (list || []).map(item => this._normalize(item));
    }

    _normalize(item) {
      if (!item) { return null; }
      var model = {
        id: item.id,
        name: item.name,
        category: item.category,
        accountId: item.accountId,
        limitAmount: item.limitAmount,
        currency: item.currency,
        period: item.period,
        currentSpend: item.currentSpend,
        status: item.status,
        alertEnabled: !!item.alertEnabled,
        createdAt: item.createdAt ? new Date(item.createdAt) : null,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : null
      };
      if (!model.id) {
        this.$log.warn('Invalid BudgetModel payload', item);
      }
      return model;
    }

    getBudgets() {
      return this._budgets;
    }

    getBudgetById(id) {
      return this._budgets.find(b => b.id === id) || null;
    }

    clear() {
      this._budgets = [];
    }
  }

  angular
    .module('davBanking.budgetAlerts')
    .service('BudgetModelService', BudgetModelService);
})();
