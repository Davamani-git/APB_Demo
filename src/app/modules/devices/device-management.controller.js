(function() {
  'use strict';
  angular.module('energyDashboard.devices')
    .controller('DeviceManagementController', ['$scope', '$timeout', 'DeviceService', function($scope, $timeout, DeviceService) {
      const vm = this;
      vm.loading = false;
      vm.error = null;
      vm.success = null;
      vm.devices = [];
      vm.selectedDevices = [];
      vm.groupId = '';
      vm.discovering = false;
      vm.init = function() {
        vm.loadDevices();
      };
      vm.loadDevices = function() {
        vm.loading = true;
        DeviceService.getAllDevices()
          .then(function(devices) {
            vm.devices = devices;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load devices';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.discoverDevices = function() {
        vm.discovering = true;
        vm.error = null;
        vm.success = null;
        DeviceService.discoverDevices()
          .then(function(newDevices) {
            vm.success = 'Discovered ' + newDevices.length + ' new devices';
            vm.discovering = false;
            vm.loadDevices();
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Device discovery failed';
            vm.discovering = false;
            $scope.$apply();
          });
      };
      vm.toggleDeviceSelection = function(deviceId) {
        const index = vm.selectedDevices.indexOf(deviceId);
        if (index > -1) {
          vm.selectedDevices.splice(index, 1);
        } else {
          vm.selectedDevices.push(deviceId);
        }
      };
      vm.groupSelectedDevices = function() {
        if (vm.selectedDevices.length === 0 || !vm.groupId) {
          vm.error = 'Please select devices and enter a group ID';
          return;
        }
        DeviceService.groupDevices(vm.selectedDevices, vm.groupId)
          .then(function(response) {
            vm.success = 'Devices grouped successfully';
            vm.selectedDevices = [];
            vm.groupId = '';
            vm.loadDevices();
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to group devices';
            $scope.$apply();
          });
      };
      vm.deleteDevice = function(deviceId) {
        if (!confirm('Are you sure you want to delete this device?')) {
          return;
        }
        DeviceService.deleteDevice(deviceId)
          .then(function(response) {
            vm.success = 'Device deleted successfully';
            vm.loadDevices();
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to delete device';
            $scope.$apply();
          });
      };
      vm.updateDevice = function(device) {
        DeviceService.updateDevice(device.id, device)
          .then(function(response) {
            vm.success = 'Device updated successfully';
            vm.loadDevices();
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to update device';
            $scope.$apply();
          });
      };
      vm.init();
    }]);
})();