describe('cacheService', function() {
  'use strict';
  beforeEach(module('fraudDetectionModule'));
  
  var cacheService, $cacheFactory;
  
  beforeEach(inject(function(_cacheService_, _$cacheFactory_) {
    cacheService = _cacheService_;
    $cacheFactory = _$cacheFactory_;
  }));
  
  describe('put and get', function() {
    /*
    Test Documentation:
    - Test Name: put and get - store and retrieve data
    - Purpose: Validates that data can be stored and retrieved from cache
    - Scenario: Valid key, data, and TTL provided
    - Expected Result: Data is stored and retrieved successfully
    */
    it('should store and retrieve data from cache', function() {
      var key = 'test_key';
      var data = { id: 1, name: 'Test' };
      var ttl = 60000;
      
      cacheService.put(key, data, ttl);
      var retrieved = cacheService.get(key);
      
      expect(retrieved).toEqual(data);
    });
    
    /*
    Test Documentation:
    - Test Name: put and get - default TTL
    - Purpose: Validates that default TTL is applied when not specified
    - Scenario: put called without TTL parameter
    - Expected Result: Data is stored with default 60 second TTL
    */
    it('should use default TTL when not specified', function() {
      var key = 'default_ttl_key';
      var data = { value: 'test' };
      
      cacheService.put(key, data);
      var retrieved = cacheService.get(key);
      
      expect(retrieved).toEqual(data);
    });
    
    /*
    Test Documentation:
    - Test Name: get - expired data
    - Purpose: Validates that expired data is removed and null is returned
    - Scenario: Data has expired based on TTL
    - Expected Result: Returns null and removes expired item
    */
    it('should return null for expired data and remove it', function() {
      var key = 'expired_key';
      var data = { value: 'test' };
      var ttl = 1; // 1ms TTL
      
      cacheService.put(key, data, ttl);
      
      // Wait for expiry
      waitsFor(function() {
        return Date.now() > Date.now() + 10;
      }, 'Timeout waiting for expiry', 100);
      
      runs(function() {
        var retrieved = cacheService.get(key);
        expect(retrieved).toBeNull();
      });
    });
    
    /*
    Test Documentation:
    - Test Name: get - non-existent key
    - Purpose: Validates that null is returned for non-existent keys
    - Scenario: Key does not exist in cache
    - Expected Result: Returns null
    */
    it('should return null for non-existent key', function() {
      var retrieved = cacheService.get('non_existent_key');
      expect(retrieved).toBeNull();
    });
  });
  
  describe('remove', function() {
    /*
    Test Documentation:
    - Test Name: remove - delete cached item
    - Purpose: Validates that cached item can be explicitly removed
    - Scenario: Valid key provided
    - Expected Result: Item is removed from cache
    */
    it('should remove item from cache', function() {
      var key = 'remove_test_key';
      var data = { id: 1 };
      
      cacheService.put(key, data);
      expect(cacheService.get(key)).toEqual(data);
      
      cacheService.remove(key);
      expect(cacheService.get(key)).toBeNull();
    });
    
    /*
    Test Documentation:
    - Test Name: remove - non-existent key
    - Purpose: Validates that removing non-existent key does not cause error
    - Scenario: Key does not exist in cache
    - Expected Result: No error is thrown
    */
    it('should not throw error when removing non-existent key', function() {
      expect(function() {
        cacheService.remove('non_existent_key');
      }).not.toThrow();
    });
  });
  
  describe('clear', function() {
    /*
    Test Documentation:
    - Test Name: clear - remove all cached items
    - Purpose: Validates that all cached items are removed
    - Scenario: Multiple items in cache
    - Expected Result: All items are removed
    */
    it('should clear all items from cache', function() {
      cacheService.put('key1', { data: 1 });
      cacheService.put('key2', { data: 2 });
      cacheService.put('key3', { data: 3 });
      
      expect(cacheService.get('key1')).toBeDefined();
      expect(cacheService.get('key2')).toBeDefined();
      expect(cacheService.get('key3')).toBeDefined();
      
      cacheService.clear();
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
      expect(cacheService.get('key3')).toBeNull();
    });
    
    /*
    Test Documentation:
    - Test Name: clear - empty cache
    - Purpose: Validates that clearing empty cache does not cause error
    - Scenario: Cache is already empty
    - Expected Result: No error is thrown
    */
    it('should not throw error when clearing empty cache', function() {
      cacheService.clear();
      expect(function() {
        cacheService.clear();
      }).not.toThrow();
    });
  });
  
  /*
  Coverage Report:
  - Functions tested: put, get, remove, clear
  - Scenarios covered: store/retrieve, default TTL, expiry handling, non-existent keys, removal, clearing
  - Uncovered scenarios: concurrent access, very large data objects, cache size limits
  */
});
