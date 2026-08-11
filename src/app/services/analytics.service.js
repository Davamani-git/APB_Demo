(function() {
  'use strict';
  angular.module('energyDashboard')
    .service('AnalyticsService', ['EnergyDataService', 'PricingService', function(EnergyDataService, PricingService) {
      this.calculateTrends = function(data, period) {
        if (!data || !data.dataPoints) {
          return EnergyDataService.getMockHistoricalData(period);
        }
        const trends = {
          period: period,
          dataPoints: data.dataPoints,
          totalConsumption: 0,
          totalCost: 0,
          averageDaily: 0,
          peakConsumption: 0,
          peakTime: null
        };
        data.dataPoints.forEach(function(point) {
          trends.totalConsumption += point.consumption;
          trends.totalCost += point.cost;
          if (point.consumption > trends.peakConsumption) {
            trends.peakConsumption = point.consumption;
            trends.peakTime = point.date;
          }
        });
        trends.averageDaily = trends.totalConsumption / data.dataPoints.length;
        return trends;
      };
      this.aggregateDeviceMetrics = function(devices) {
        if (!devices || !devices.length) return [];
        const metrics = devices.map(function(device) {
          return {
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            deviceType: device.deviceType,
            totalConsumption: device.consumption,
            currentPower: device.power,
            status: device.status,
            costEstimate: device.consumption * 0.2
          };
        });
        return metrics.sort((a, b) => b.totalConsumption - a.totalConsumption);
      };
      this.calculateCostEstimate = function(consumption, pricing) {
        if (!pricing) return consumption * 0.2;
        return consumption * pricing.ratePerKwh;
      };
    }]);
})();