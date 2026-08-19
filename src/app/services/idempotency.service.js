angular.module('fraudDetectionApp').service('IdempotencyService', ['$cacheFactory', 'StorageService', function($cacheFactory, StorageService) {
  var cache = $cacheFactory('idempotencyCache');
  var STORAGE_KEY = 'processedTransactions';

  this.isDuplicate = function(transactionId) {
    if (cache.get(transactionId)) {
      return true;
    }
    var stored = StorageService.get(STORAGE_KEY) || [];
    return stored.indexOf(transactionId) !== -1;
  };

  this.markProcessed = function(transactionId) {
    cache.put(transactionId, true);
    var stored = StorageService.get(STORAGE_KEY) || [];
    if (stored.indexOf(transactionId) === -1) {
      stored.push(transactionId);
      if (stored.length > 1000) {
        stored = stored.slice(-1000);
      }
      StorageService.set(STORAGE_KEY, stored);
    }
  };

  this.clearProcessed = function(transactionId) {
    cache.remove(transactionId);
    var stored = StorageService.get(STORAGE_KEY) || [];
    var index = stored.indexOf(transactionId);
    if (index !== -1) {
      stored.splice(index, 1);
      StorageService.set(STORAGE_KEY, stored);
    }
  };

  this.clearAll = function() {
    cache.removeAll();
    StorageService.remove(STORAGE_KEY);
  };
}]);