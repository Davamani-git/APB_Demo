angular.module('app.wearables')
.factory('ActivityDataModel', [function() {
function ActivityData(data) {
this.userId = data.userId || null;
this.deviceId = data.deviceId || null;
this.deviceType = data.deviceType || null;
this.timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
this.steps = data.steps || 0;
this.heartRate = data.heartRate || 0;
this.caloriesBurned = data.caloriesBurned || 0;
this.distance = data.distance || 0;
this.workoutSessions = data.workoutSessions || [];
this.syncStatus = data.syncStatus || 'pending';
this.lastSyncTime = data.lastSyncTime ? new Date(data.lastSyncTime) : null;
}
ActivityData.prototype.toJSON = function() {
return {
userId: this.userId,
deviceId: this.deviceId,
deviceType: this.deviceType,
timestamp: this.timestamp.toISOString(),
steps: this.steps,
heartRate: this.heartRate,
caloriesBurned: this.caloriesBurned,
distance: this.distance,
workoutSessions: this.workoutSessions,
syncStatus: this.syncStatus,
lastSyncTime: this.lastSyncTime ? this.lastSyncTime.toISOString() : null
};
};
return ActivityData;
}]);