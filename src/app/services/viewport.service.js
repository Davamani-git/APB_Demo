angular.module('executiveDashboard').service('ViewportService', ['$window', '$rootScope', '$timeout', function($window, $rootScope, $timeout) {
let debounceTimer = null;
const breakpoints = {
sm: 768,
md: 1200,
lg: 1920
};
this.getViewportState = function() {
const width = $window.innerWidth;
const height = $window.innerHeight;
let deviceType = 'desktop';
let breakpoint = 'lg';
if (width < breakpoints.sm) {
deviceType = 'mobile';
breakpoint = 'sm';
} else if (width < breakpoints.md) {
deviceType = 'tablet';
breakpoint = 'md';
} else if (width >= breakpoints.lg) {
deviceType = 'presentation';
breakpoint = 'xl';
}
return {
width: width,
height: height,
deviceType: deviceType,
orientation: width > height ? 'landscape' : 'portrait',
breakpoint: breakpoint
};
};
this.onResize = function(callback) {
angular.element($window).on('resize', function() {
if (debounceTimer) {
$timeout.cancel(debounceTimer);
}
debounceTimer = $timeout(function() {
const state = this.getViewportState();
callback(state);
$rootScope.$broadcast('viewport:resize', state);
}.bind(this), 250);
}.bind(this));
};
this.init = function() {
this.onResize(function() {});
};
}]);
