angular.module('executiveDashboard').controller('ThemeEditorController', ['$scope', '$rootScope', 'ThemeService', 'KpiService', 'TestingScopeService', function($scope, $rootScope, ThemeService, KpiService, TestingScopeService) {
const vm = this;
vm.isOpen = false;
vm.kpiElements = [];
vm.scopeElements = [];
vm.groupColors = {};
vm.bulkKpiColor = '#ffffff';
vm.bulkScopeColor = '#ffffff';
vm.openThemeEditor = function() {
const theme = ThemeService.getCurrentTheme();
const kpis = KpiService.getKpis();
vm.kpiElements = kpis.map(kpi => ({
id: kpi.id,
label: kpi.label,
color: theme.kpiTiles[kpi.id] || '#ffffff'
}));
const scopes = TestingScopeService.getTestingScopes();
vm.scopeElements = scopes.map(scope => ({
id: scope.id,
name: scope.name,
color: theme.scopeTiles[scope.id] || '#ffffff'
}));
vm.groupColors = {
inProgress: theme.statusGroups.inProgress || '#e3f2fd',
designInProgress: theme.statusGroups.designInProgress || '#fff3e0'
};
vm.isOpen = true;
};
vm.close = function() {
vm.isOpen = false;
};
vm.applyKpiColor = function(kpiId, color) {
ThemeService.applyColor(kpiId, color, 'kpi');
};
vm.applyScopeColor = function(scopeId, color) {
ThemeService.applyColor(scopeId, color, 'scope');
};
vm.applyGroupColor = function(groupId, color) {
ThemeService.applyColor(groupId, color, 'group');
};
vm.applyColorToAllKpis = function() {
const color = prompt('Enter hex color for all KPI tiles (e.g., #4CAF50):');
if (color) {
vm.kpiElements.forEach(kpi => {
kpi.color = color;
vm.applyKpiColor(kpi.id, color);
});
}
};
vm.applyColorToAllScopes = function() {
const color = prompt('Enter hex color for all scope tiles (e.g., #2196F3):');
if (color) {
vm.scopeElements.forEach(scope => {
scope.color = color;
vm.applyScopeColor(scope.id, color);
});
}
};
vm.saveTheme = function() {
const theme = ThemeService.getCurrentTheme();
ThemeService.saveTheme(theme);
alert('Theme saved successfully!');
vm.close();
};
vm.resetTheme = function() {
if (confirm('Reset to default theme? This will clear all customizations.')) {
const defaultTheme = ThemeService.resetTheme();
vm.openThemeEditor();
}
};
$rootScope.$on('theme:open', function() {
vm.openThemeEditor();
});
}]);
