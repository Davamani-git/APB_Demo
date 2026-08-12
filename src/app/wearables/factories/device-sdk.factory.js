angular.module('app.wearables')
.factory('DeviceSDKFactory', ['$q', '$window', '$http', function($q, $window, $http) {
var factory = {};
var SDK_ENDPOINTS = {
apple: '/api/wearables/apple/sync',
fitbit: '/api/wearables/fitbit/sync',
garmin: '/api/wearables/garmin/sync',
wearos: '/api/wearables/wearos/sync'
};
factory.authenticateDevice = function(deviceType) {
var deferred = $q.defer();
if (!SDK_ENDPOINTS[deviceType]) {
deferred.reject('Unsupported device type: ' + deviceType);
return deferred.promise;
}
var authUrl = '/api/wearables/' + deviceType + '/auth';
$http.post(authUrl, {})
.then(function(response) {
if (response.data && response.data.authToken) {
deferred.resolve({
deviceId: response.data.deviceId,
deviceType: deviceType,
deviceName: response.data.deviceName || deviceType,
isConnected: true,
authToken: response.data.authToken,
lastSyncTime: new Date(),
syncInterval: 60
});
} else {
deferred.reject('Authentication failed: Invalid response');
}
})
.catch(function(error) {
deferred.reject('Authentication error: ' + (error.data ? error.data.message : error.statusText));
});
return deferred.promise;
};
factory.fetchDeviceData = function(deviceType, authToken) {
var deferred = $q.defer();
if (!SDK_ENDPOINTS[deviceType]) {
deferred.reject('Unsupported device type');
return deferred.promise;
}
$http.get(SDK_ENDPOINTS[deviceType], {
headers: {'Authorization': 'Bearer ' + authToken}
})
.then(function(response) {
if (response.data) {
deferred.resolve({
steps: response.data.steps || 0,
heartRate: response.data.heartRate || 0,
caloriesBurned: response.data.caloriesBurned || 0,
distance: response.data.distance || 0,
workoutSessions: response.data.workoutSessions || [],
timestamp: new Date(),
deviceType: deviceType
});
} else {
deferred.reject('No data received');
}
})
.catch(function(error) {
deferred.reject('Network Error: ' + (error.statusText || 'Unable to fetch data'));
});
return deferred.promise;
};
factory.disconnectDevice = function(deviceId) {
var deferred = $q.defer();
$http.post('/api/wearables/disconnect', {deviceId: deviceId})
.then(function() {
deferred.resolve();
})
.catch(function(error) {
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);