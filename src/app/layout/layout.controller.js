angular.module('executiveDashboard').controller('LayoutController', ['$scope', 'ViewportService', 'VisualHierarchyService', 'PerformanceService', function($scope, ViewportService, VisualHierarchyService, PerformanceService) {
const vm = this;
vm.layoutClasses = [];
vm.viewportState = {};
vm.init = function() {
PerformanceService.startLoadTracking();
vm.viewportState = ViewportService.getViewportState();
vm.updateLayoutClasses();
ViewportService.onResize(function(state) {
vm.viewportState = state;
vm.updateLayoutClasses();
$scope.$apply();
});
const aboveFold = VisualHierarchyService.getAboveFoldElements();
console.log('Above fold elements:', aboveFold);
};
vm.updateLayoutClasses = function() {
vm.layoutClasses = [
'device-' + vm.viewportState.deviceType,
'breakpoint-' + vm.viewportState.breakpoint,
'orientation-' + vm.viewportState.orientation
];
};
vm.init();
}]);
