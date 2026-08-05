(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .factory('KpiModel', KpiModel);

  function KpiModel() {
    var prototype = {
      id: null,
      name: '',
      description: '',
      value: 0,
      unit: '%',
      targetValue: null,
      plannedCompletionDate: null,
      lastUpdated: null,
      category: 'EXEC',
      status: 'On Track',
      metadata: {
        sourceSystem: null,
        lastSourceSync: null
      }
    };

    return {
      create: function(data) {
        var kpi = angular.copy(prototype);
        angular.extend(kpi, data || {});
        return kpi;
      }
    };
  }
})();
