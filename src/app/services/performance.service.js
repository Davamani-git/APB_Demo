angular.module('executiveDashboard').service('PerformanceService', ['$timeout', function($timeout) {
let loadStartTime = null;
let metrics = {
loadStartTime: 0,
domContentLoadedTime: 0,
totalLoadTime: 0,
renderTime: 0,
targetLoadTime: 2000
};
this.startLoadTracking = function() {
loadStartTime = performance.now();
metrics.loadStartTime = loadStartTime;
};
this.endLoadTracking = function() {
if (!loadStartTime) return metrics;
const endTime = performance.now();
metrics.totalLoadTime = Math.round(endTime - loadStartTime);
metrics.renderTime = metrics.totalLoadTime;
if (metrics.totalLoadTime > metrics.targetLoadTime) {
console.warn('Load time exceeded target:', metrics.totalLoadTime + 'ms');
}
return metrics;
};
this.getMetrics = function() {
return metrics;
};
this.measureRenderTime = function(callback) {
const start = performance.now();
$timeout(function() {
const end = performance.now();
const renderTime = Math.round(end - start);
callback(renderTime);
}, 0);
};
}]);
