angular.module('executiveDashboard').controller('DashboardController', ['$scope', '$rootScope', 'KpiService', 'TestingScopeService', 'ThemeService', 'PerformanceService', function($scope, $rootScope, KpiService, TestingScopeService, ThemeService, PerformanceService) {
const vm = this;
PerformanceService.startLoadTracking();
vm.kpis = [];
vm.inProgressScopes = [];
vm.designInProgressScopes = [];
vm.init = function() {
vm.kpis = KpiService.getKpis();
vm.inProgressScopes = TestingScopeService.getInProgressScopes();
vm.designInProgressScopes = TestingScopeService.getDesignInProgressScopes();
PerformanceService.endLoadTracking();
};
vm.openDataEditor = function() {
$rootScope.$broadcast('dataEditor:open');
};
vm.getKpiColor = function(kpiId) {
return ThemeService.getKpiColor(kpiId);
};
vm.getScopeColor = function(scopeId) {
return ThemeService.getScopeColor(scopeId);
};
vm.getGroupColor = function(groupId) {
return ThemeService.getGroupColor(groupId);
};
$rootScope.$on('data:updated', function() {
vm.init();
});
$rootScope.$on('theme:updated', function() {
$scope.$apply();
});
vm.init();
}]);
