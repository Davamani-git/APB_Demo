angular.module('executiveDashboard').service('LocalStorageService', ['$window', function($window) {
const storage = $window.localStorage;
this.get = function(key) {
try {
const data = storage.getItem(key);
return data ? JSON.parse(data) : null;
} catch(e) {
console.error('LocalStorage get error:', e);
return null;
}
};
this.set = function(key, value) {
try {
storage.setItem(key, JSON.stringify(value));
return true;
} catch(e) {
console.error('LocalStorage set error:', e);
return false;
}
};
this.remove = function(key) {
try {
storage.removeItem(key);
return true;
} catch(e) {
console.error('LocalStorage remove error:', e);
return false;
}
};
this.clear = function() {
try {
storage.clear();
return true;
} catch(e) {
console.error('LocalStorage clear error:', e);
return false;
}
};
}]);
