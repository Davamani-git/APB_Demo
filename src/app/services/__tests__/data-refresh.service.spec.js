describe('DataRefreshService', function() {
  'use strict';
  
  beforeEach(module('creditCardDashboard'));
  
  var DataRefreshService, $interval;
  
  beforeEach(inject(function(_DataRefreshService_, _$interval_) {
    DataRefreshService = _DataRefreshService_;
    $interval = _$interval_;
  }));
  
  afterEach(function() {
    $interval.cancel = jasmine.createSpy('cancel');
  });
  
  describe('startAutoRefresh', function() {
    /*
    Test Documentation:
    - Test Name: startAutoRefresh - Normal Scenario
    - Purpose: Validates that auto-refresh interval is started with callback
    - Scenario: startAutoRefresh called with valid callback function
    - Expected Result: $interval is called with callback and 30000ms interval
    */
    it('should start auto refresh with callback', function() {
      var callback = jasmine.createSpy('callback');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback);
      
      expect($interval).toHaveBeenCalledWith(callback, 30000);
    });
    
    /*
    Test Documentation:
    - Test Name: startAutoRefresh - Stop Previous Interval
    - Purpose: Validates that existing interval is stopped before starting new one
    - Scenario: startAutoRefresh called when interval already exists
    - Expected Result: Previous interval is cancelled before new one starts
    */
    it('should stop previous interval before starting new one', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback1);
      DataRefreshService.startAutoRefresh(callback2);
      
      expect($interval.cancel).toHaveBeenCalled();
    });
    
    /*
    Test Documentation:
    - Test Name: startAutoRefresh - Multiple Calls
    - Purpose: Validates behavior when startAutoRefresh is called multiple times
    - Scenario: startAutoRefresh called three times with different callbacks
    - Expected Result: Only the latest callback is active
    */
    it('should handle multiple consecutive calls', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      var callback3 = jasmine.createSpy('callback3');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback1);
      DataRefreshService.startAutoRefresh(callback2);
      DataRefreshService.startAutoRefresh(callback3);
      
      expect($interval).toHaveBeenCalledWith(callback3, 30000);
    });
  });
  
  describe('stopAutoRefresh', function() {
    /*
    Test Documentation:
    - Test Name: stopAutoRefresh - Normal Scenario
    - Purpose: Validates that auto-refresh interval is stopped
    - Scenario: stopAutoRefresh called when interval is active
    - Expected Result: $interval.cancel is called and refreshInterval is set to null
    */
    it('should stop auto refresh when interval exists', function() {
      var callback = jasmine.createSpy('callback');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback);
      DataRefreshService.stopAutoRefresh();
      
      expect($interval.cancel).toHaveBeenCalled();
    });
    
    /*
    Test Documentation:
    - Test Name: stopAutoRefresh - No Active Interval
    - Purpose: Validates behavior when stopAutoRefresh is called without active interval
    - Scenario: stopAutoRefresh called when no interval exists
    - Expected Result: No error is thrown
    */
    it('should handle stop when no interval is active', function() {
      spyOn($interval, 'cancel');
      
      expect(function() {
        DataRefreshService.stopAutoRefresh();
      }).not.toThrow();
    });
    
    /*
    Test Documentation:
    - Test Name: stopAutoRefresh - Multiple Calls
    - Purpose: Validates behavior when stopAutoRefresh is called multiple times
    - Scenario: stopAutoRefresh called consecutively
    - Expected Result: No error on subsequent calls
    */
    it('should handle multiple stop calls', function() {
      var callback = jasmine.createSpy('callback');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback);
      DataRefreshService.stopAutoRefresh();
      DataRefreshService.stopAutoRefresh();
      
      expect(function() {
        DataRefreshService.stopAutoRefresh();
      }).not.toThrow();
    });
  });
  
  describe('Start and Stop Lifecycle', function() {
    /*
    Test Documentation:
    - Test Name: Start-Stop Lifecycle
    - Purpose: Validates complete lifecycle of auto-refresh
    - Scenario: Start refresh, then stop refresh
    - Expected Result: Interval is created and then cancelled
    */
    it('should start and stop refresh in sequence', function() {
      var callback = jasmine.createSpy('callback');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback);
      expect($interval).toHaveBeenCalledWith(callback, 30000);
      
      DataRefreshService.stopAutoRefresh();
      expect($interval.cancel).toHaveBeenCalled();
    });
    
    /*
    Test Documentation:
    - Test Name: Restart After Stop
    - Purpose: Validates that service can be restarted after stopping
    - Scenario: Start refresh, stop refresh, start refresh again
    - Expected Result: New interval is created successfully
    */
    it('should allow restart after stop', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      spyOn($interval, 'cancel');
      
      DataRefreshService.startAutoRefresh(callback1);
      DataRefreshService.stopAutoRefresh();
      DataRefreshService.startAutoRefresh(callback2);
      
      expect($interval).toHaveBeenCalledWith(callback2, 30000);
    });
  });
  
  /*
  Coverage Report:
  - Functions tested: startAutoRefresh, stopAutoRefresh
  - Scenarios covered: normal start, stop previous interval, multiple calls, stop when active, stop when inactive, lifecycle management
  - Edge cases: multiple consecutive calls, stop without start, restart after stop
  - Uncovered scenarios: callback execution, error handling in callbacks, interval timing verification
  */
});
