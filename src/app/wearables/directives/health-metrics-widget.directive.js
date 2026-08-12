angular.module('app.wearables')
.directive('healthMetricsWidget', [function() {
return {
restrict: 'E',
scope: {
activityData: '=',
lastSync: '='
},
templateUrl: 'src/app/wearables/views/health-metrics-widget.html',
link: function(scope, element, attrs) {
scope.getHeartRateClass = function() {
var hr = scope.activityData.heartRate;
if (hr < 60) return 'text-info';
if (hr >= 60 && hr <= 100) return 'text-success';
if (hr > 100 && hr <= 140) return 'text-warning';
return 'text-danger';
};
scope.getStepsProgress = function() {
var target = 10000;
var progress = (scope.activityData.steps / target) * 100;
return Math.min(progress, 100);
};
scope.formatDistance = function(meters) {
if (!meters) return '0.00';
return (meters / 1000).toFixed(2);
};
}
};
}]);