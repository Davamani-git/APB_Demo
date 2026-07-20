(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('KpiModel', KpiModelFactory);

  KpiModelFactory.$inject = [];

  function KpiModelFactory() {
    function KpiModel(data) {
      this.id = data && data.id || '';
      this.label = data && data.label || '';
      this.value = data && typeof data.value === 'number' ? data.value : 0;
      this.unit = data && data.unit || '';
      this.formattedValue = data && data.formattedValue || '';
    }

    return KpiModel;
  }
})();
