angular.module('app.wearables')
.service('WearableSyncService', ['$http', '$interval', '$q', 'DeviceSDKFactory', 'OfflineCacheService', 'ActivityDataModel', function($http, $interval, $q, DeviceSDKFactory, OfflineCacheService, ActivityDataModel) {
var self = this;
var syncIntervalPromise = null;
var SYNC_INTERVAL_MS = 60000;
var RETRY_ATTEMPTS = 3;
var RETRY_DELAY_MS = 2000;
this.connectedDevices = [];
this.latestActivityData = null;
this.isSyncing = false;
this.requestSync = function(deviceConnection) {
var deferred = $q.defer();
if (!deviceConnection || !deviceConnection.deviceId) {
deferred.reject('Invalid device connection');
return deferred.promise;
}
self.isSyncing = true;
DeviceSDKFactory.fetchDeviceData(deviceConnection.deviceType, deviceConnection.authToken)
.then(function(rawData) {
var activityData = new ActivityDataModel({
userId: 'current_user',
deviceId: deviceConnection.deviceId,
deviceType: deviceConnection.deviceType,
timestamp: rawData.timestamp,
steps: rawData.steps,
heartRate: rawData.heartRate,
caloriesBurned: rawData.caloriesBurned,
distance: rawData.distance,
workoutSessions: rawData.workoutSessions,
syncStatus: 'synced',
lastSyncTime: new Date()
});
return self.storeActivityData(activityData);
})
.then(function(storedData) {
self.latestActivityData = storedData;
deviceConnection.lastSyncTime = new Date();
self.isSyncing = false;
deferred.resolve(storedData);
})
.catch(function(error) {
var activityData = new ActivityDataModel({
userId: 'current_user',
deviceId: deviceConnection.deviceId,
deviceType: deviceConnection.deviceType,
timestamp: new Date(),
steps: 0,
heartRate: 0,
caloriesBurned: 0,
distance: 0,
workoutSessions: [],
syncStatus: 'failed',
lastSyncTime: new Date()
});
OfflineCacheService.cacheData(activityData.toJSON())
.then(function() {
self.isSyncing = false;
deferred.reject('Sync failed, data cached: ' + error);
})
.catch(function(cacheError) {
self.isSyncing = false;
deferred.reject('Sync and cache failed: ' + error + ', ' + cacheError);
});
});
return deferred.promise;
};
this.storeActivityData = function(activityData) {
var deferred = $q.defer();
var encryptedData = {
data: btoa(JSON.stringify(activityData.toJSON())),
timestamp: new Date().toISOString()
};
$http.post('/api/wearables/store', encryptedData)
.then(function(response) {
deferred.resolve(activityData);
})
.catch(function(error) {
deferred.reject('Store error: ' + (error.data ? error.data.message : error.statusText));
});
return deferred.promise;
};
this.startBackgroundSync = function(deviceConnection) {
if (syncIntervalPromise) {
$interval.cancel(syncIntervalPromise);
}
syncIntervalPromise = $interval(function() {
if (!self.isSyncing) {
self.requestSync(deviceConnection).catch(function(error) {
console.error('Background sync error:', error);
});
}
}, SYNC_INTERVAL_MS);
return syncIntervalPromise;
};
this.stopBackgroundSync = function() {
if (syncIntervalPromise) {
$interval.cancel(syncIntervalPromise);
syncIntervalPromise = null;
}
};
this.retryFailedSyncs = function() {
var deferred = $q.defer();
var retryQueue = OfflineCacheService.getRetryQueue();
if (retryQueue.length === 0) {
deferred.resolve([]);
return deferred.promise;
}
var retryPromises = [];
retryQueue.forEach(function(cacheKey) {
var cachedData = OfflineCacheService.getCachedData(cacheKey);
if (cachedData) {
var activityData = new ActivityDataModel(cachedData);
activityData.syncStatus = 'synced';
var retryPromise = self.storeActivityData(activityData)
.then(function() {
OfflineCacheService.removeFromCache(cacheKey);
return {success: true, key: cacheKey};
})
.catch(function(error) {
return {success: false, key: cacheKey, error: error};
});
retryPromises.push(retryPromise);
}
});
$q.all(retryPromises).then(function(results) {
deferred.resolve(results);
});
return deferred.promise;
};
this.addConnectedDevice = function(deviceConnection) {
var existingIndex = self.connectedDevices.findIndex(function(d) {
return d.deviceId === deviceConnection.deviceId;
});
if (existingIndex > -1) {
self.connectedDevices[existingIndex] = deviceConnection;
} else {
self.connectedDevices.push(deviceConnection);
}
};
this.getConnectedDevices = function() {
return self.connectedDevices;
};
this.removeDevice = function(deviceId) {
var index = self.connectedDevices.findIndex(function(d) {
return d.deviceId === deviceId;
});
if (index > -1) {
self.connectedDevices.splice(index, 1);
}
};
}]);