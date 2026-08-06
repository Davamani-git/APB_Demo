angular.module('executiveDashboard').service('ThemeService', ['ThemeStorageService', 'ContrastValidatorFactory', '$rootScope', function(ThemeStorageService, ContrastValidatorFactory, $rootScope) {
let activeTheme = null;
this.getCurrentTheme = function() {
if (!activeTheme) {
activeTheme = ThemeStorageService.loadTheme();
}
return activeTheme;
};
this.applyColor = function(elementId, color, elementType) {
if (!this.validateColor(color)) {
console.warn('Invalid color format:', color);
return false;
}
const theme = this.getCurrentTheme();
if (elementType === 'kpi') {
theme.kpiTiles[elementId] = color;
} else if (elementType === 'scope') {
theme.scopeTiles[elementId] = color;
} else if (elementType === 'group') {
theme.statusGroups[elementId] = color;
}
const isValid = ContrastValidatorFactory.validateContrast(color, '#ffffff');
if (!isValid) {
console.warn('Low contrast detected for color:', color);
}
activeTheme = theme;
$rootScope.$broadcast('theme:updated', theme);
return true;
};
this.validateColor = function(color) {
const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
return hexRegex.test(color);
};
this.saveTheme = function(theme) {
const success = ThemeStorageService.persistTheme(theme);
if (success) {
activeTheme = theme;
$rootScope.$broadcast('theme:saved', theme);
}
return success;
};
this.resetTheme = function() {
const defaultTheme = ThemeStorageService.resetTheme();
activeTheme = defaultTheme;
$rootScope.$broadcast('theme:reset', defaultTheme);
return defaultTheme;
};
this.getKpiColor = function(kpiId) {
const theme = this.getCurrentTheme();
return theme.kpiTiles[kpiId] || '#ffffff';
};
this.getScopeColor = function(scopeId) {
const theme = this.getCurrentTheme();
return theme.scopeTiles[scopeId] || '#ffffff';
};
this.getGroupColor = function(groupId) {
const theme = this.getCurrentTheme();
return theme.statusGroups[groupId] || '#f5f5f5';
};
}]);
