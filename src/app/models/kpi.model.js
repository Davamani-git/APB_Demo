(function () {
  'use strict';

  angular
    .module('apbDemo')
    .factory('KpiModel', KpiModelFactory);

  KpiModelFactory.$inject = [];
  function KpiModelFactory() {
    function KpiModel(data) {
      data = data || {};
      this.id = data.id || '';
      this.label = data.label || '';
      this.value = typeof data.value === 'number' ? data.value : 0;
      this.unit = data.unit || '';
      this.formattedValue = data.formattedValue || '';
      this.trend = data.trend || null;
      this.supportingLabel = data.supportingLabel || '';
      this.iconClass = data.iconClass || '';
    }

    return KpiModel;
  }
})();
