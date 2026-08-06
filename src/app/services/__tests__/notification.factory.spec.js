/*
Test Documentation:
- Test Name: NotificationFactory addNotification
- Purpose: Validates notification is added and broadcast event is triggered
- Scenario: New notification added
- Expected Result: Notification stored and event broadcast
*/
/*
Test Documentation:
- Test Name: NotificationFactory getNotifications
- Purpose: Validates retrieval of all notifications
- Scenario: Multiple notifications exist
- Expected Result: All notifications returned
*/
/*
Test Documentation:
- Test Name: NotificationFactory clearNotifications
- Purpose: Validates all notifications are cleared
- Scenario: Clear notifications called
- Expected Result: Notification array is empty
*/
/*
Test Documentation:
- Test Name: NotificationFactory removeNotification
- Purpose: Validates specific notification is removed by index
- Scenario: Remove notification at specific index
- Expected Result: Notification at index is removed
*/
/*
Coverage Report:
- Functions tested: addNotification, getNotifications, clearNotifications, removeNotification
- Scenarios covered: add notification with broadcast, get all notifications, clear all, remove by index, remove invalid index
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('NotificationFactory', function() {
    var NotificationFactory, $rootScope;

    beforeEach(module('shoppingPlatform'));

    beforeEach(inject(function(_NotificationFactory_, _$rootScope_) {
      NotificationFactory = _NotificationFactory_;
      $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
      NotificationFactory.clearNotifications();
    });

    describe('addNotification', function() {
      it('should add notification to the list', function() {
        var notification = { type: 'info', message: 'Test notification' };

        NotificationFactory.addNotification(notification);

        var notifications = NotificationFactory.getNotifications();
        expect(notifications.length).toBe(1);
        expect(notifications[0]).toEqual(notification);
      });

      it('should broadcast notification:new event when notification is added', function() {
        var notification = { type: 'warning', message: 'Warning message' };
        var eventFired = false;
        var eventData = null;

        $rootScope.$on('notification:new', function(event, data) {
          eventFired = true;
          eventData = data;
        });

        NotificationFactory.addNotification(notification);

        expect(eventFired).toBe(true);
        expect(eventData).toEqual(notification);
      });

      it('should add multiple notifications', function() {
        var notification1 = { type: 'info', message: 'First' };
        var notification2 = { type: 'error', message: 'Second' };

        NotificationFactory.addNotification(notification1);
        NotificationFactory.addNotification(notification2);

        var notifications = NotificationFactory.getNotifications();
        expect(notifications.length).toBe(2);
        expect(notifications[0]).toEqual(notification1);
        expect(notifications[1]).toEqual(notification2);
      });
    });

    describe('getNotifications', function() {
      it('should return empty array when no notifications exist', function() {
        var notifications = NotificationFactory.getNotifications();

        expect(notifications).toEqual([]);
      });

      it('should return all notifications', function() {
        var notification1 = { type: 'info', message: 'First' };
        var notification2 = { type: 'success', message: 'Second' };

        NotificationFactory.addNotification(notification1);
        NotificationFactory.addNotification(notification2);

        var notifications = NotificationFactory.getNotifications();

        expect(notifications.length).toBe(2);
        expect(notifications).toContain(notification1);
        expect(notifications).toContain(notification2);
      });
    });

    describe('clearNotifications', function() {
      it('should clear all notifications', function() {
        NotificationFactory.addNotification({ type: 'info', message: 'Test 1' });
        NotificationFactory.addNotification({ type: 'info', message: 'Test 2' });

        expect(NotificationFactory.getNotifications().length).toBe(2);

        NotificationFactory.clearNotifications();

        expect(NotificationFactory.getNotifications().length).toBe(0);
      });
    });

    describe('removeNotification', function() {
      it('should remove notification at specified index', function() {
        var notification1 = { type: 'info', message: 'First' };
        var notification2 = { type: 'warning', message: 'Second' };
        var notification3 = { type: 'error', message: 'Third' };

        NotificationFactory.addNotification(notification1);
        NotificationFactory.addNotification(notification2);
        NotificationFactory.addNotification(notification3);

        NotificationFactory.removeNotification(1);

        var notifications = NotificationFactory.getNotifications();
        expect(notifications.length).toBe(2);
        expect(notifications[0]).toEqual(notification1);
        expect(notifications[1]).toEqual(notification3);
      });

      it('should remove first notification when index is 0', function() {
        var notification1 = { type: 'info', message: 'First' };
        var notification2 = { type: 'info', message: 'Second' };

        NotificationFactory.addNotification(notification1);
        NotificationFactory.addNotification(notification2);

        NotificationFactory.removeNotification(0);

        var notifications = NotificationFactory.getNotifications();
        expect(notifications.length).toBe(1);
        expect(notifications[0]).toEqual(notification2);
      });

      it('should handle removal with invalid index gracefully', function() {
        var notification1 = { type: 'info', message: 'First' };
        NotificationFactory.addNotification(notification1);

        NotificationFactory.removeNotification(10);

        var notifications = NotificationFactory.getNotifications();
        expect(notifications.length).toBe(1);
      });
    });
  });
})();