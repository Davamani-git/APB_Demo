(function() {
  'use strict';
  angular.module('energyDashboard')
    .service('EnergyDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const self = this;
      this.fetchRealTimeData = function() {
        const deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.realtime, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.fetchHistoricalData = function(period) {
        const deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.historical, {
          params: { period: period },
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.getMockRealTimeData = function() {
        return {
          timestamp: new Date(),
          totalConsumption: 12.5,
          instantaneousPower: 3.2,
          cost: 2.5,
          devices: [
            { deviceId: 'dev-001', deviceName: 'Air Conditioner', deviceType: 'hvac', consumption: 5.2, power: 1.8, status: 'active', lastUpdated: new Date() },
            { deviceId: 'dev-002', deviceName: 'Refrigerator', deviceType: 'appliance', consumption: 3.1, power: 0.8, status: 'active', lastUpdated: new Date() },
            { deviceId: 'dev-003', deviceName: 'Living Room Lights', deviceType: 'lighting', consumption: 0.5, power: 0.2, status: 'active', lastUpdated: new Date() },
            { deviceId: 'dev-004', deviceName: 'Water Heater', deviceType: 'appliance', consumption: 3.7, power: 0.4, status: 'idle', lastUpdated: new Date() }
          ]
        };
      };
      this.getMockHistoricalData = function(period) {
        const dataPoints = [];
        const count = period === 'daily' ? 24 : period === 'weekly' ? 7 : 30;
        for (let i = 0; i < count; i++) {
          dataPoints.push({
            date: new Date(Date.now() - (count - i) * 3600000),
            consumption: Math.random() * 15 + 5,
            cost: Math.random() * 3 + 1
          });
        }
        return {
          period: period,
          dataPoints: dataPoints,
          totalConsumption: dataPoints.reduce((sum, dp) => sum + dp.consumption, 0),
          totalCost: dataPoints.reduce((sum, dp) => sum + dp.cost, 0),
          averageDaily: dataPoints.reduce((sum, dp) => sum + dp.consumption, 0) / count
        };
      };
    }]);
})();