(function() {
  'use strict';
  angular.module('executiveDashboardApp').service('StatusDataService', ['LocalStorageFactory', function(LocalStorageFactory) {
    this.saveStatusData = function(data) {
      try {
        return LocalStorageFactory.store('statusData', data);
      } catch(e) {
        console.error('Error saving status data:', e);
        return false;
      }
    };
    this.getStatusData = function() {
      try {
        return LocalStorageFactory.retrieve('statusData') || [];
      } catch(e) {
        console.error('Error getting status data:', e);
        return [];
      }
    };
    this.updateEta = function(scopeId, eta) {
      try {
        var data = this.getStatusData();
        var index = data.findIndex(function(item) { return item.scopeId === scopeId; });
        if (index !== -1) {
          data[index].eta = eta;
          return this.saveStatusData(data);
        }
        return false;
      } catch(e) {
        console.error('Error updating ETA:', e);
        return false;
      }
    };
  }]);
})();