(function () {
  'use strict';

  angular
    .module('execSummary.models')
    .factory('ScopeModel', [function () {
      function createDefaults() {
        return [
          createScope('SPRINT', 'Sprint'),
          createScope('REGRESSION', 'Regression'),
          createScope('API', 'API'),
          createScope('UI', 'UI'),
          createScope('PERFORMANCE', 'Performance'),
          createScope('DEPLOYMENT', 'Deployment'),
          createScope('ROLLBACK', 'Roll Back'),
          createScope('BACKWARD_COMP', 'Backward Compatibility'),
          createScope('INTEGRATION', 'Integration'),
          createScope('USABILITY', 'Usability'),
          createScope('CONTRACT', 'Contract'),
          createScope('GUARDRAIL', 'Guardrail')
        ];
      }

      function createScope(id, name) {
        return {
          id: id,
          name: name,
          totalUseCases: 0,
          completedUseCases: 0,
          pendingUseCases: 0,
          agentificationPercent: 0,
          readinessStatus: 'IN_PROGRESS',
          notes: ''
        };
      }

      return {
        createDefaults: createDefaults,
        createScope: createScope
      };
    }]);
})();