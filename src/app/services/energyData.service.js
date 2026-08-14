(function() {
  'use strict';
  angular.module('energyMonitoringApp').service('EnergyDataService', ['$http', '$q', EnergyDataService]);
  function EnergyDataService($http, $q) {
    const API_BASE = 'https://api.smarthome.example.com';
    this.fetchRealTimeData = function() {
      return $http.get(API_BASE + '/api/energy/realtime').then(function(response) {
        return {
          timestamp: new Date(response.data.timestamp),
          totalUsage: response.data.totalUsage || 0,
          cost: response.data.cost || 0,
          deviceBreakdown: response.data.deviceBreakdown || []
        };
      }).catch(function(error) {
        console.error('Failed to fetch real-time data:', error);
        return $q.reject(error);
      });
    };
    this.fetchHistoricalData = function(period) {
      return $http.get(API_BASE + '/api/energy/historical', {
        params: { period: period || 'daily' }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Failed to fetch historical data:', error);
        return $q.reject(error);
      });
    };
    this.fetchDeviceData = function(deviceId) {
      return $http.get(API_BASE + '/api/energy/device/' + deviceId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.error('Failed to fetch device data:', error);
        return $q.reject(error);
      });
    };
  }
})();