'use strict';

(function () {
  class AlertModelService {
    constructor($log) {
      'ngInject';
      this.$log = $log;
      this._alerts = [];
    }

    setAlerts(list) {
      this._alerts = (list || []).map(item => this._normalize(item));
    }

    _normalize(item) {
      if (!item) { return null; }
      var model = {
        id: item.id,
        budgetId: item.budgetId,
        category: item.category,
        amount: item.amount,
        currency: item.currency,
        triggerType: item.triggerType,
        triggeredAt: item.triggeredAt ? new Date(item.triggeredAt) : null,
        channel: item.channel,
        status: item.status
      };
      if (!model.id) {
        this.$log.warn('Invalid AlertModel payload', item);
      }
      return model;
    }

    getAlerts() {
      return this._alerts;
    }

    getAlertById(id) {
      return this._alerts.find(a => a.id === id) || null;
    }
  }

  angular
    .module('davBanking.budgetAlerts')
    .service('AlertModelService', AlertModelService);
})();
