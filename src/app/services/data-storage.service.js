(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('DataStorageService', ['LocalStorageFactory', 'CalculationService', function(LocalStorageFactory, CalculationService) {
    var self = this;
    this.saveKpiData = function(data) {
      try {
        var calculatedData = CalculationService.calculatePercentages(data);
        return LocalStorageFactory.store('kpiData', calculatedData);
      } catch(e) {
        console.error('Error saving KPI data:', e);
        return false;
      }
    };
    this.getKpiData = function() {
      try {
        var data = LocalStorageFactory.retrieve('kpiData');
        if (!data) {
          data = [
            {id: 'testingUseCases', title: 'Testing Use Cases', completed: 45, total: 120, unit: 'cases'},
            {id: 'agents', title: 'Overall Agents', completed: 12, total: 30, unit: 'agents'},
            {id: 'workflows', title: 'Workflows', completed: 8, total: 15, unit: 'workflows'},
            {id: 'apbFlows', title: 'APB Flows', completed: 5, total: 10, unit: 'flows'}
          ];
          this.saveKpiData(data);
        }
        return CalculationService.calculatePercentages(data);
      } catch(e) {
        console.error('Error getting KPI data:', e);
        return [];
      }
    };
    this.saveScopeData = function(data) {
      try {
        var calculatedData = CalculationService.calculatePercentages(data);
        return LocalStorageFactory.store('scopeData', calculatedData);
      } catch(e) {
        console.error('Error saving scope data:', e);
        return false;
      }
    };
    this.getScopeData = function() {
      try {
        var data = LocalStorageFactory.retrieve('scopeData');
        if (!data) {
          data = [
            {scopeId: 'sprint', scopeName: 'Sprint Testing', status: 'In Progress', useCaseCompleted: 8, useCaseTotal: 15, agentCompleted: 2, agentTotal: 5, eta: '2024-03-15'},
            {scopeId: 'regression', scopeName: 'Regression Testing', status: 'In Progress', useCaseCompleted: 12, useCaseTotal: 20, agentCompleted: 3, agentTotal: 6, eta: '2024-03-20'},
            {scopeId: 'api', scopeName: 'API Automation', status: 'In Progress', useCaseCompleted: 15, useCaseTotal: 25, agentCompleted: 4, agentTotal: 8, eta: '2024-03-25'},
            {scopeId: 'ui', scopeName: 'UI Automation', status: 'Design in Progress', useCaseCompleted: 5, useCaseTotal: 18, agentCompleted: 1, agentTotal: 6, eta: '2024-04-01'},
            {scopeId: 'performance', scopeName: 'Performance Testing', status: 'Design in Progress', useCaseCompleted: 3, useCaseTotal: 12, agentCompleted: 0, agentTotal: 4, eta: '2024-04-05'},
            {scopeId: 'deployment', scopeName: 'Deployment Testing', status: 'Design in Progress', useCaseCompleted: 2, useCaseTotal: 10, agentCompleted: 0, agentTotal: 3, eta: '2024-04-10'},
            {scopeId: 'rollback', scopeName: 'Roll Back Testing', status: 'In Progress', useCaseCompleted: 4, useCaseTotal: 8, agentCompleted: 1, agentTotal: 2, eta: '2024-03-18'},
            {scopeId: 'backwardCompatibility', scopeName: 'Backward Compatibility Testing', status: 'Design in Progress', useCaseCompleted: 1, useCaseTotal: 6, agentCompleted: 0, agentTotal: 2, eta: '2024-04-15'},
            {scopeId: 'integration', scopeName: 'Integration Testing', status: 'In Progress', useCaseCompleted: 10, useCaseTotal: 22, agentCompleted: 3, agentTotal: 7, eta: '2024-03-22'},
            {scopeId: 'usability', scopeName: 'Usability Testing', status: 'Design in Progress', useCaseCompleted: 2, useCaseTotal: 8, agentCompleted: 0, agentTotal: 3, eta: '2024-04-20'},
            {scopeId: 'contract', scopeName: 'Contract Testing', status: 'In Progress', useCaseCompleted: 6, useCaseTotal: 14, agentCompleted: 2, agentTotal: 5, eta: '2024-03-28'},
            {scopeId: 'guardrail', scopeName: 'Guardrail Testing', status: 'Design in Progress', useCaseCompleted: 1, useCaseTotal: 5, agentCompleted: 0, agentTotal: 2, eta: '2024-04-25'}
          ];
          this.saveScopeData(data);
        }
        return CalculationService.calculatePercentages(data);
      } catch(e) {
        console.error('Error getting scope data:', e);
        return [];
      }
    };
  }]);
})();