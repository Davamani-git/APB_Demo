(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .factory('DataTransformFactory', [function() {
      var transformers = {
        apple_watch: function(data) {
          return {
            userId: data.user_id,
            deviceType: 'apple_watch',
            metricType: data.type,
            value: data.value,
            unit: data.unit,
            timestamp: new Date(data.timestamp),
            syncedAt: new Date(),
            source: 'Apple Health'
          };
        },
        fitbit: function(data) {
          return {
            userId: data.userId,
            deviceType: 'fitbit',
            metricType: data.metricType,
            value: data.metricValue,
            unit: data.metricUnit,
            timestamp: new Date(data.recordedAt),
            syncedAt: new Date(),
            source: 'Fitbit SDK'
          };
        },
        garmin: function(data) {
          return {
            userId: data.uid,
            deviceType: 'garmin',
            metricType: data.metric,
            value: data.val,
            unit: data.u,
            timestamp: new Date(data.ts),
            syncedAt: new Date(),
            source: 'Garmin Connect'
          };
        },
        wear_os: function(data) {
          return {
            userId: data.user,
            deviceType: 'wear_os',
            metricType: data.dataType,
            value: data.dataValue,
            unit: data.dataUnit,
            timestamp: new Date(data.time),
            syncedAt: new Date(),
            source: 'Wear OS'
          };
        }
      };
      return {
        normalize: function(rawData) {
          if (!rawData || !Array.isArray(rawData)) {
            return [];
          }
          return rawData.map(function(item) {
            var deviceType = item.deviceType || item.device_type || 'apple_watch';
            var transformer = transformers[deviceType] || transformers.apple_watch;
            return transformer(item);
          });
        }
      };
    }]);
})();