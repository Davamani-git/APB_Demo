(function() {
  'use strict';
  angular.module('energyDashboard.devices')
    .controller('DeviceController', ['$scope', '$routeParams', 'DeviceService', 'EnergyDataService', function($scope, $routeParams, DeviceService, EnergyDataService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.devices = [];
      vm.selectedDevice = null;
      vm.deviceConsumption = [];
      vm.init = function() {
        vm.loading = true;
        vm.loadDevices();
      };
      vm.loadDevices = function() {
        DeviceService.getAllDevices()
          .then(function(devices) {
            vm.devices = devices;
            vm.loading = false;
            vm.enrichDevicesWithConsumption();
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load devices';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.enrichDevicesWithConsumption = function() {
        EnergyDataService.fetchRealTimeData()
          .then(function(data) {
            vm.devices.forEach(function(device) {
              const consumptionData = data.devices.find(function(d) {
                return d.deviceId === device.id;
              });
              if (consumptionData) {
                device.consumption = consumptionData.consumption;
                device.power = consumptionData.power;
                device.cost = consumptionData.consumption * 0.2;
              }
            });
            $scope.$apply();
          })
          .catch(function(error) {
            const mockData = EnergyDataService.getMockRealTimeData();
            vm.devices.forEach(function(device) {
              const consumptionData = mockData.devices.find(function(d) {
                return d.deviceId === device.id;
              });
              if (consumptionData) {
                device.consumption = consumptionData.consumption;
                device.power = consumptionData.power;
                device.cost = consumptionData.consumption * 0.2;
              }
            });
            $scope.$apply();
          });
      };
      vm.selectDevice = function(device) {
        vm.selectedDevice = device;
      };
      vm.controlDevice = function(deviceId, command) {
        DeviceService.controlDevice(deviceId, command)
          .then(function(response) {
            vm.loadDevices();
          })
          .catch(function(error) {
            vm.error = 'Failed to control device';
            $scope.$apply();
          });
      };
      vm.init();
    }]);
})();