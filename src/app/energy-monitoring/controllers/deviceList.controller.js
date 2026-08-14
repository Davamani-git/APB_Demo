(function() {
  'use strict';
  angular.module('energyMonitoringApp').controller('DeviceListController', ['EnergyDataService', DeviceListController]);
  function DeviceListController(EnergyDataService) {
    const vm = this;
    vm.devices = [];
    vm.loading = true;
    vm.selectedDevice = null;
    vm.init = function() {
      vm.loadDevices();
    };
    vm.loadDevices = function() {
      EnergyDataService.fetchRealTimeData().then(function(data) {
        vm.devices = data.deviceBreakdown || [];
        vm.loading = false;
      }).catch(function() {
        vm.loading = false;
      });
    };
    vm.selectDevice = function(device) {
      vm.selectedDevice = device;
      EnergyDataService.fetchDeviceData(device.deviceId).then(function(data) {
        vm.selectedDevice.history = data;
      });
    };
    vm.init();
  }
})();