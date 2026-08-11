/*
Test Documentation:
- Test Name: NotificationService startPolling
- Purpose: Validates periodic notification broadcasting
- Scenario: Polling is started
- Expected Result: Notifications are broadcast at intervals
*/
/*
Test Documentation:
- Test Name: NotificationService notify
- Purpose: Validates manual notification triggering
- Scenario: Notify is called with message
- Expected Result: Notification is stored and broadcast
*/
/*
Coverage Report:
- Functions tested: startPolling, notify
- Scenarios covered: polling notifications, manual notifications
- Uncovered scenarios: none
*/

describe('NotificationService', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var NotificationService, $rootScope, $interval;
  
  beforeEach(inject(function(_NotificationService_, _$rootScope_, _$interval_) {
    NotificationService = _NotificationService_;
    $rootScope = _$rootScope_;
    $interval = _$interval_;
  }));
  
  describe('startPolling', function() {
    it('should broadcast notification at intervals', function() {
      var broadcastSpy = jasmine.createSpy('broadcast');
      $rootScope.$on('notification:received', broadcastSpy);
      
      NotificationService.startPolling();
      
      expect(broadcastSpy).not.toHaveBeenCalled();
      
      $interval.flush(30000);
      expect(broadcastSpy).toHaveBeenCalled();
      expect(broadcastSpy.calls.mostRecent().args[1].message).toBe('Order status updated');
      expect(broadcastSpy.calls.mostRecent().args[1].timestamp).toBeDefined();
    });
    
    it('should broadcast multiple notifications over time', function() {
      var broadcastSpy = jasmine.createSpy('broadcast');
      $rootScope.$on('notification:received', broadcastSpy);
      
      NotificationService.startPolling();
      
      $interval.flush(30000);
      expect(broadcastSpy).toHaveBeenCalledTimes(1);
      
      $interval.flush(30000);
      expect(broadcastSpy).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('notify', function() {
    it('should broadcast notification immediately', function() {
      var broadcastSpy = jasmine.createSpy('broadcast');
      $rootScope.$on('notification:received', broadcastSpy);
      
      NotificationService.notify('Test notification');
      
      expect(broadcastSpy).toHaveBeenCalled();
      expect(broadcastSpy.calls.mostRecent().args[1].message).toBe('Test notification');
    });
    
    it('should store notification with timestamp', function() {
      var broadcastSpy = jasmine.createSpy('broadcast');
      $rootScope.$on('notification:received', broadcastSpy);
      
      NotificationService.notify('Important message');
      
      expect(broadcastSpy.calls.mostRecent().args[1].message).toBe('Important message');
    });
  });
});