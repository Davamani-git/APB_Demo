(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('ProgressTrackingService', ['LocalStorageFactory', 'CalculationService', function(LocalStorageFactory, CalculationService) {
    this.getProgressData = function() {
      try {
        var data = LocalStorageFactory.retrieve('progressData');
        if (!data) {
          data = {
            kpis: [
              {id: 'testingUseCases', title: 'Testing Use Cases', completed: 45, total: 120},
              {id: 'agents', title: 'Overall Agents', completed: 12, total: 30},
              {id: 'workflows', title: 'Workflows', completed: 8, total: 15},
              {id: 'apbFlows', title: 'APB Flows', completed: 5, total: 10}
            ],
            scopes: []
          };
          this.saveProgress(data);
        }
        data.kpis = CalculationService.calculatePercentages(data.kpis);
        data.scopes = CalculationService.calculatePercentages(data.scopes);
        return data;
      } catch(e) {
        console.error('Error getting progress data:', e);
        return {kpis: [], scopes: []};
      }
    };
    this.saveProgress = function(data) {
      try {
        return LocalStorageFactory.store('progressData', data);
      } catch(e) {
        console.error('Error saving progress data:', e);
        return false;
      }
    };
  }]);
})();