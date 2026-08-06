(function() {
  'use strict';
  angular.module('executiveDashboardApp').factory('LocalStorageFactory', ['$window', function($window) {
    return {
      store: function(key, value) {
        try {
          $window.localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch(e) {
          console.error('LocalStorage store error:', e);
          return false;
        }
      },
      retrieve: function(key) {
        try {
          var item = $window.localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch(e) {
          console.error('LocalStorage retrieve error:', e);
          return null;
        }
      },
      remove: function(key) {
        try {
          $window.localStorage.removeItem(key);
          return true;
        } catch(e) {
          console.error('LocalStorage remove error:', e);
          return false;
        }
      },
      clear: function() {
        try {
          $window.localStorage.clear();
          return true;
        } catch(e) {
          console.error('LocalStorage clear error:', e);
          return false;
        }
      }
    };
  }]);
})();