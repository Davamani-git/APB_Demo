angular.module('fraudDetectionApp').service('StorageService', [function() {
  var storage = window.localStorage;

  this.get = function(key) {
    try {
      var value = storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  };

  this.set = function(key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  };

  this.remove = function(key) {
    storage.removeItem(key);
  };

  this.clear = function() {
    storage.clear();
  };
}]);