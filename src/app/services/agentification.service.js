(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('AgentificationService', ['LocalStorageFactory', function(LocalStorageFactory) {
    this.getAgentificationProgress = function() {
      try {
        var data = LocalStorageFactory.retrieve('agentificationData');
        if (!data) {
          data = [
            {scopeId: 'sprint', agentificationProgress: 40, eta: new Date('2024-03-15')},
            {scopeId: 'regression', agentificationProgress: 50, eta: new Date('2024-03-20')},
            {scopeId: 'api', agentificationProgress: 60, eta: new Date('2024-03-25')},
            {scopeId: 'ui', agentificationProgress: 28, eta: new Date('2024-04-01')},
            {scopeId: 'performance', agentificationProgress: 25, eta: new Date('2024-04-05')},
            {scopeId: 'deployment', agentificationProgress: 20, eta: new Date('2024-04-10')},
            {scopeId: 'rollback', agentificationProgress: 50, eta: new Date('2024-03-18')},
            {scopeId: 'backwardCompatibility', agentificationProgress: 17, eta: new Date('2024-04-15')},
            {scopeId: 'integration', agentificationProgress: 45, eta: new Date('2024-03-22')},
            {scopeId: 'usability', agentificationProgress: 25, eta: new Date('2024-04-20')},
            {scopeId: 'contract', agentificationProgress: 43, eta: new Date('2024-03-28')},
            {scopeId: 'guardrail', agentificationProgress: 20, eta: new Date('2024-04-25')}
          ];
          LocalStorageFactory.store('agentificationData', data);
        }
        return data;
      } catch(e) {
        console.error('Error getting agentification progress:', e);
        return [];
      }
    };
    this.saveAgentificationProgress = function(scopeId, progress, eta) {
      try {
        var data = this.getAgentificationProgress();
        var index = data.findIndex(function(item) { return item.scopeId === scopeId; });
        if (index !== -1) {
          data[index].agentificationProgress = progress;
          data[index].eta = eta;
        } else {
          data.push({scopeId: scopeId, agentificationProgress: progress, eta: eta});
        }
        return LocalStorageFactory.store('agentificationData', data);
      } catch(e) {
        console.error('Error saving agentification progress:', e);
        return false;
      }
    };
  }]);
})();