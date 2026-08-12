angular.module('app.wearables')
.controller('DevicePairingController', ['$scope', '$location', 'DeviceSDKFactory', 'WearableSyncService', function($scope, $location, DeviceSDKFactory, WearableSyncService) {
var vm = this;
vm.availableDevices = [
{type: 'apple', name: 'Apple Watch', icon: '⌚', description: 'Sync with Apple Health'},
{type: 'fitbit', name: 'Fitbit', icon: '⌚', description: 'Connect Fitbit devices'},
{type: 'garmin', name: 'Garmin', icon: '⌚', description: 'Pair Garmin wearables'},
{type: 'wearos', name: 'Wear OS', icon: '⌚', description: 'Google Wear OS devices'}
];
vm.pairingInProgress = false;
vm.pairingError = null;
vm.pairingSuccess = false;
vm.selectedDevice = null;
vm.initiateDevicePairing = function(deviceType) {
vm.pairingInProgress = true;
vm.pairingError = null;
vm.pairingSuccess = false;
vm.selectedDevice = deviceType;
DeviceSDKFactory.authenticateDevice(deviceType)
.then(function(deviceConnection) {
WearableSyncService.addConnectedDevice(deviceConnection);
WearableSyncService.startBackgroundSync(deviceConnection);
vm.pairingSuccess = true;
vm.pairingInProgress = false;
vm.pairingError = null;
setTimeout(function() {
$scope.$apply(function() {
$location.path('/dashboard');
});
}, 2000);
})
.catch(function(error) {
vm.pairingError = error;
vm.pairingInProgress = false;
vm.pairingSuccess = false;
$scope.$apply();
});
};
vm.cancelPairing = function() {
vm.pairingInProgress = false;
vm.pairingError = null;
vm.selectedDevice = null;
};
$scope.$on('$destroy', function() {
vm.pairingInProgress = false;
});
}]);