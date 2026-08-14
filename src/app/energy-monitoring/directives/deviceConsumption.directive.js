(function() {
  'use strict';
  angular.module('energyMonitoringApp').directive('deviceConsumption', ['EnergyDataService', deviceConsumption]);
  function deviceConsumption(EnergyDataService) {
    return {
      restrict: 'E',
      scope: {
        device: '='
      },
      template: '<div class="device-item">' +
                '<h4>{{device.deviceName}} <span ng-class="{\"status-online\": device.status === \"online\", \"status-offline\": device.status !== \"online\"}">{{device.status}}</span></h4>' +
                '<p><strong>Usage:</strong> {{device.usage}} kWh</p>' +
                '<p><strong>Device ID:</strong> {{device.deviceId}}</p>' +
                '</div>',
      link: function(scope) {
        scope.$watch('device', function(newDevice) {
          if (newDevice && newDevice.deviceId) {
            EnergyDataService.fetchDeviceData(newDevice.deviceId).then(function(data) {
              scope.device.detailedData = data;
            });
          }
        });
      }
    };
  }
})();