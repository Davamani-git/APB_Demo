angular.module('app.wearables')
.controller('ActivityDashboardController', ['$scope', '$interval', 'WearableSyncService', 'OfflineCacheService', function($scope, $interval, WearableSyncService, OfflineCacheService) {
var vm = this;
vm.connectedDevices = [];
vm.activityData = {
steps: 0,
heartRate: 0,
caloriesBurned: 0,
distance: 0,
workoutSessions: []
};
vm.isSyncing = false;
vm.lastSyncTime = null;
vm.syncError = null;
vm.init = function() {
vm.connectedDevices = WearableSyncService.getConnectedDevices();
if (vm.connectedDevices.length > 0) {
vm.loadActivityData();
}
WearableSyncService.retryFailedSyncs();
};
vm.loadActivityData = function() {
if (vm.connectedDevices.length === 0) {
return;
}
vm.isSyncing = true;
vm.syncError = null;
var primaryDevice = vm.connectedDevices[0];
WearableSyncService.requestSync(primaryDevice)
.then(function(activityData) {
vm.activityData = {
steps: activityData.steps || 0,
heartRate: activityData.heartRate || 0,
caloriesBurned: activityData.caloriesBurned || 0,
distance: activityData.distance || 0,
workoutSessions: activityData.workoutSessions || []
};
vm.lastSyncTime = new Date();
vm.isSyncing = false;
vm.syncError = null;
$scope.$apply();
})
.catch(function(error) {
vm.syncError = error;
vm.isSyncing = false;
$scope.$apply();
});
};
vm.manualSync = function() {
vm.loadActivityData();
};
vm.disconnectDevice = function(deviceId) {
WearableSyncService.removeDevice(deviceId);
vm.connectedDevices = WearableSyncService.getConnectedDevices();
if (vm.connectedDevices.length === 0) {
vm.activityData = {
steps: 0,
heartRate: 0,
caloriesBurned: 0,
distance: 0,
workoutSessions: []
};
}
};
vm.formatDistance = function(meters) {
if (!meters) return '0.00';
return (meters / 1000).toFixed(2);
};
vm.formatLastSync = function() {
if (!vm.lastSyncTime) return 'Never';
var now = new Date();
var diff = Math.floor((now - vm.lastSyncTime) / 1000);
if (diff < 60) return diff + 's ago';
if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
return Math.floor(diff / 3600) + 'h ago';
};
vm.init();
$scope.$on('$destroy', function() {
WearableSyncService.stopBackgroundSync();
});
}]);