(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('StatusManagementService', ['LocalStorageFactory', function(LocalStorageFactory) {
    this.getStatusData = function() {
      try {
        var data = LocalStorageFactory.retrieve('testingScopeStatus');
        if (!data) {
          data = [
            {scopeId: 'sprint', scopeName: 'Sprint Testing', status: 'In Progress', lastUpdated: new Date()},
            {scopeId: 'regression', scopeName: 'Regression Testing', status: 'In Progress', lastUpdated: new Date()},
            {scopeId: 'api', scopeName: 'API Automation', status: 'In Progress', lastUpdated: new Date()},
            {scopeId: 'ui', scopeName: 'UI Automation', status: 'Design in Progress', lastUpdated: new Date()},
            {scopeId: 'performance', scopeName: 'Performance Testing', status: 'Design in Progress', lastUpdated: new Date()},
            {scopeId: 'deployment', scopeName: 'Deployment Testing', status: 'Design in Progress', lastUpdated: new Date()},
            {scopeId: 'rollback', scopeName: 'Roll Back Testing', status: 'In Progress', lastUpdated: new Date()},
            {scopeId: 'backwardCompatibility', scopeName: 'Backward Compatibility Testing', status: 'Design in Progress', lastUpdated: new Date()},
            {scopeId: 'integration', scopeName: 'Integration Testing', status: 'In Progress', lastUpdated: new Date()},
            {scopeId: 'usability', scopeName: 'Usability Testing', status: 'Design in Progress', lastUpdated: new Date()},
            {scopeId: 'contract', scopeName: 'Contract Testing', status: 'In Progress', lastUpdated: new Date()},
            {scopeId: 'guardrail', scopeName: 'Guardrail Testing', status: 'Design in Progress', lastUpdated: new Date()}
          ];
          this.saveStatusUpdate(null, data);
        }
        return data;
      } catch(e) {
        console.error('Error getting status data:', e);
        return [];
      }
    };
    this.saveStatusUpdate = function(scopeId, data) {
      try {
        if (scopeId) {
          var allData = this.getStatusData();
          var index = allData.findIndex(function(s) { return s.scopeId === scopeId; });
          if (index !== -1) {
            allData[index] = data;
            allData[index].lastUpdated = new Date();
          }
          return LocalStorageFactory.store('testingScopeStatus', allData);
        } else {
          return LocalStorageFactory.store('testingScopeStatus', data);
        }
      } catch(e) {
        console.error('Error saving status update:', e);
        return false;
      }
    };
  }]);
})();