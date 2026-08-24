angular.module('fraudDetection').service('IdempotencyService', ['$cacheFactory', function($cacheFactory) {
  var processedCache = $cacheFactory('transactionIdempotency', {capacity: 1000});
  
  this.isDuplicate = function(transactionId) {
    return !!processedCache.get(transactionId);
  };
  
  this.markProcessed = function(transactionId) {
    processedCache.put(transactionId, {
      processedAt: new Date(),
      transactionId: transactionId
    });
  };
  
  this.clearCache = function() {
    processedCache.removeAll();
  };
  
  this.getCacheInfo = function() {
    return processedCache.info();
  };
}]);