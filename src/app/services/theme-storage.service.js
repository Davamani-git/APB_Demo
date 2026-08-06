angular.module('executiveDashboard').service('ThemeStorageService', ['$window', function($window) {
const STORAGE_KEY = 'dashboard.theme.active';
const storage = $window.localStorage;
this.loadTheme = function() {
try {
const data = storage.getItem(STORAGE_KEY);
return data ? JSON.parse(data) : this.getDefaultTheme();
} catch(e) {
console.error('Theme load error:', e);
return this.getDefaultTheme();
}
};
this.persistTheme = function(theme) {
try {
storage.setItem(STORAGE_KEY, JSON.stringify(theme));
return true;
} catch(e) {
console.error('Theme persist error:', e);
return false;
}
};
this.getDefaultTheme = function() {
return {
id: 'default',
name: 'Default Theme',
dashboardBackground: '#f5f5f5',
kpiTiles: {},
scopeTiles: {},
statusGroups: {
inProgress: '#e3f2fd',
designInProgress: '#fff3e0'
},
indicators: {
progress: '#2196F3',
warning: '#FF9800',
success: '#4CAF50'
},
createdAt: new Date().toISOString(),
isDefault: true
};
};
this.resetTheme = function() {
try {
storage.removeItem(STORAGE_KEY);
return this.getDefaultTheme();
} catch(e) {
console.error('Theme reset error:', e);
return this.getDefaultTheme();
}
};
}]);
