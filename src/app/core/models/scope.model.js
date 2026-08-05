(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .factory('ScopeModel', ScopeModel);

  function ScopeModel() {
    var prototype = {
      id: null,
      name: '',
      type: 'sprint',
      status: 'Not Started',
      totalCases: 0,
      executedCases: 0,
      passedCases: 0,
      agentificationRequired: false,
      agentificationEta: null,
      plannedCompletionDate: null,
      readinessFlag: 'Unknown',
      lastUpdated: null,
      notes: '',
      grouping: {
        portfolio: null,
        program: null,
        team: null
      }
    };

    return {
      create: function(data) {
        var scope = angular.copy(prototype);
        angular.extend(scope, data || {});
        return scope;
      }
    };
  }
})();
