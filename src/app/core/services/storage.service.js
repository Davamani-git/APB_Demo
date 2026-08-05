(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('StorageService', StorageService);

  StorageService.$inject = ['$window', '$q', 'ErrorHandlingService', 'LoggingService'];
  function StorageService($window, $q, ErrorHandlingService, LoggingService) {
    var STORAGE_KEY = 'execDashboardState';
    var BACKUP_KEY = 'execDashboardStateBackup';

    this.loadState = function() {
      var deferred = $q.defer();
      try {
        if (!this.isStorageAvailable()) {
          deferred.resolve(null);
          return deferred.promise;
        }
        var raw = $window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          deferred.resolve(null);
          return deferred.promise;
        }
        var parsed = JSON.parse(raw);
        deferred.resolve(parsed);
      } catch (e) {
        LoggingService.error('Error loading state', e);
        ErrorHandlingService.handleStorageError(e);
        deferred.reject(e);
      }
      return deferred.promise;
    };

    this.saveState = function(state) {
      var deferred = $q.defer();
      try {
        if (!this.isStorageAvailable()) {
          deferred.reject(new Error('Storage not available'));
          return deferred.promise;
        }
        var serialized = JSON.stringify(state);
        $window.localStorage.setItem(STORAGE_KEY, serialized);
        deferred.resolve();
      } catch (e) {
        LoggingService.error('Error saving state', e);
        ErrorHandlingService.handleStorageError(e);
        deferred.reject(e);
      }
      return deferred.promise;
    };

    this.backupCorruptedState = function(raw) {
      try {
        if (!this.isStorageAvailable()) {
          return;
        }
        $window.localStorage.setItem(BACKUP_KEY, raw);
      } catch (e) {
        LoggingService.error('Error backing up corrupted state', e);
      }
    };

    this.clearState = function() {
      if (!this.isStorageAvailable()) {
        return;
      }
      $window.localStorage.removeItem(STORAGE_KEY);
    };

    this.isStorageAvailable = function() {
      try {
        var storage = $window.localStorage;
        var testKey = '__storage_test__';
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    };
  }
})();
