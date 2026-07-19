(function () {
  'use strict';

  SpendSummaryModelFactory.$inject = ['MetricsModel'];

  angular
    .module('app')
    .factory('SpendSummaryModel', SpendSummaryModelFactory);

  function SpendSummaryModelFactory(MetricsModel) {
    function SpendSummaryModel(props) {
      var p = props || {};

      this.cardId = p.cardId || '';
      this.month = p.month || '';
      this.currency = p.currency || 'USD';
      this.metrics = p.metrics instanceof MetricsModel ? p.metrics : new MetricsModel(p.metrics || {});
      this.breakdown = p.breakdown || {};
      this.lastUpdated = p.lastUpdated || '';
    }

    return SpendSummaryModel;
  }
})();
