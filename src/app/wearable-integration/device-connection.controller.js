(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .controller('DeviceConnectionController', ['$scope', '$http', 'SyncService', 'HealthDataService', 'API_ENDPOINT', function($scope, $http, SyncService, HealthDataService, API_ENDPOINT) {
      var vm = this;
      vm.deviceType = 'apple_watch';
      vm.connectionStatus = 'disconnected';
      vm.statusMessage = '';
      vm.connectDevice = function() {
        vm.statusMessage = 'Connecting to ' + vm.deviceType + '...';
        $http.post(API_ENDPOINT + '/device/connect', { deviceType: vm.deviceType })
          .then(function(response) {
            if (response.data.authUrl) {
              window.location.href = response.data.authUrl;
            } else {
              vm.connectionStatus = 'connected';
              vm.statusMessage = vm.deviceType + ' connected successfully. Real-time sync started.';
              SyncService.startSync();
            }
          })
          .catch(function(err) {
            vm.connectionStatus = 'error';
            vm.statusMessage = 'Failed to connect device: ' + (err.data ? err.data.message : 'Unknown error');
          });
      };
      vm.disconnectDevice = function() {
        SyncService.stopSync();
        vm.connectionStatus = 'disconnected';
        vm.statusMessage = 'Device disconnected.';
      };
      $scope.$on('$destroy', function() {
        SyncService.stopSync();
      });
    }]);
})();