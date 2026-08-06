(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('CalculationService', function() {
    this.calculatePercentage = function(completed, total) {
      if (!total || total === 0) return 0;
      return Math.round((completed / total) * 100);
    };
    this.calculatePercentages = function(data) {
      if (!data) return data;
      if (Array.isArray(data)) {
        return data.map(function(item) {
          if (item.completed !== undefined && item.total !== undefined) {
            item.percentage = this.calculatePercentage(item.completed, item.total);
          }
          if (item.useCaseCompleted !== undefined && item.useCaseTotal !== undefined) {
            item.useCasePercentage = this.calculatePercentage(item.useCaseCompleted, item.useCaseTotal);
          }
          if (item.agentCompleted !== undefined && item.agentTotal !== undefined) {
            item.agentPercentage = this.calculatePercentage(item.agentCompleted, item.agentTotal);
          }
          return item;
        }.bind(this));
      }
      if (data.completed !== undefined && data.total !== undefined) {
        data.percentage = this.calculatePercentage(data.completed, data.total);
      }
      return data;
    };
  });
})();