angular.module('app.wearables')
.service('OfflineCacheService', ['$window', '$q', function($window, $q) {
var CACHE_KEY_PREFIX = 'wearable_cache_';
var RETRY_QUEUE_KEY = 'wearable_retry_queue';
this.cacheData = function(activityData) {
var deferred = $q.defer();
try {
var cacheKey = CACHE_KEY_PREFIX + activityData.deviceId + '_' + Date.now();
var dataString = JSON.stringify(activityData);
$window.localStorage.setItem(cacheKey, dataString);
var retryQueue = this.getRetryQueue();
retryQueue.push(cacheKey);
$window.localStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(retryQueue));
deferred.resolve({cached: true, key: cacheKey});
} catch (error) {
deferred.reject('Cache error: ' + error.message);
}
return deferred.promise;
};
this.getCachedData = function(cacheKey) {
try {
var dataString = $window.localStorage.getItem(cacheKey);
if (dataString) {
return JSON.parse(dataString);
}
return null;
} catch (error) {
return null;
}
};
this.getRetryQueue = function() {
try {
var queueString = $window.localStorage.getItem(RETRY_QUEUE_KEY);
if (queueString) {
return JSON.parse(queueString);
}
return [];
} catch (error) {
return [];
}
};
this.removeFromCache = function(cacheKey) {
try {
$window.localStorage.removeItem(cacheKey);
var retryQueue = this.getRetryQueue();
var index = retryQueue.indexOf(cacheKey);
if (index > -1) {
retryQueue.splice(index, 1);
$window.localStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(retryQueue));
}
return true;
} catch (error) {
return false;
}
};
this.clearCache = function() {
try {
var retryQueue = this.getRetryQueue();
retryQueue.forEach(function(key) {
$window.localStorage.removeItem(key);
});
$window.localStorage.removeItem(RETRY_QUEUE_KEY);
return true;
} catch (error) {
return false;
}
};
}]);