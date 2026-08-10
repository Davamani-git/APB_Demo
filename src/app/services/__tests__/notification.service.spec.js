/*
Test Documentation:
- Test Name: NotificationService - showNotification - success scenario
- Purpose: Validates that showNotification creates and broadcasts a notification
- Scenario: Notification is created with message and type
- Expected Result: Notification is added to array and broadcasted
*/
/*
Test Documentation:
- Test Name: NotificationService - showNotification - default type
- Purpose: Validates that showNotification uses default type when not provided
- Scenario: Notification created without type parameter
- Expected Result: Notification type defaults to 'info'
*/
/*
Test Documentation:
- Test Name: NotificationService - showNotification - auto removal
- Purpose: Validates that notifications are automatically removed after timeout
- Scenario: Notification is created and timeout expires
- Expected Result: Notification is removed from array after 5 seconds
*/
/*
Test Documentation:
- Test Name: NotificationService - getNotifications - success scenario
- Purpose: Validates that getNotifications returns all notifications
- Scenario: Multiple notifications exist
- Expected Result: Array of all notifications returned
*/
/*
Test Documentation:
- Test Name: NotificationService - clearNotifications - success scenario
- Purpose: Validates that clearNotifications removes all notifications
- Scenario: Notifications exist and are cleared
- Expected Result: Notifications array is empty
*/
/*
Test Documentation:
- Test Name: NotificationService - connectWebSocket - success scenario
- Purpose: Validates WebSocket connection for real-time notifications
- Scenario: WebSocket connects and receives notification messages
- Expected Result: Notifications are shown when received via WebSocket
*/
/*
Test Documentation:
- Test Name: NotificationService - disconnectWebSocket - success scenario
- Purpose: Validates WebSocket disconnection
- Scenario: WebSocket is closed properly
- Expected Result: WebSocket connection closed
*/
/*
Coverage Report:
- Functions tested: showNotification, getNotifications, clearNotifications, connectWebSocket, disconnectWebSocket
- Scenarios covered: notification creation, default values, auto-removal, retrieval, clearing, WebSocket operations
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('NotificationService', function() {
    var NotificationService, $rootScope, $timeout;

    beforeEach(module('app.sellerDashboard'));

    beforeEach(inject(function(_NotificationService_, _$rootScope_, _$timeout_) {
      NotificationService = _NotificationService_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    afterEach(function() {
      NotificationService.clearNotifications();
      NotificationService.disconnectWebSocket();
    });

    describe('showNotification', function() {
      it('should create and broadcast a notification', function() {
        var message = 'Test notification';
        var type = 'success';

        spyOn($rootScope, '$broadcast');

        NotificationService.showNotification(message, type);

        var notifications = NotificationService.getNotifications();
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe(message);
        expect(notifications[0].type).toBe(type);
        expect(notifications[0].timestamp).toBeDefined();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('notification:new', jasmine.objectContaining({
          message: message,
          type: type
        }));
      });

      it('should use default type when not provided', function() {
        var message = 'Test notification';

        NotificationService.showNotification(message);

        var notifications = NotificationService.getNotifications();
        expect(notifications[0].type).toBe('info');
      });

      it('should automatically remove notification after timeout', function() {
        var message = 'Test notification';
        var type = 'warning';

        NotificationService.showNotification(message, type);

        var notifications = NotificationService.getNotifications();
        expect(notifications.length).toBe(1);

        $timeout.flush(5000);

        notifications = NotificationService.getNotifications();
        expect(notifications.length).toBe(0);
      });
    });

    describe('getNotifications', function() {
      it('should return all notifications', function() {
        NotificationService.showNotification('Notification 1', 'info');
        NotificationService.showNotification('Notification 2', 'error');

        var notifications = NotificationService.getNotifications();
        expect(notifications.length).toBe(2);
        expect(notifications[0].message).toBe('Notification 1');
        expect(notifications[1].message).toBe('Notification 2');
      });

      it('should return empty array when no notifications exist', function() {
        var notifications = NotificationService.getNotifications();
        expect(notifications.length).toBe(0);
      });
    });

    describe('clearNotifications', function() {
      it('should remove all notifications', function() {
        NotificationService.showNotification('Notification 1', 'info');
        NotificationService.showNotification('Notification 2', 'error');

        expect(NotificationService.getNotifications().length).toBe(2);

        NotificationService.clearNotifications();

        expect(NotificationService.getNotifications().length).toBe(0);
      });
    });

    describe('connectWebSocket', function() {
      it('should establish WebSocket connection and show notifications', function() {
        var sellerId = 'seller123';
        var mockWebSocket = {
          onmessage: null,
          onerror: null,
          close: jasmine.createSpy('close')
        };

        spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
        spyOn(NotificationService, 'showNotification');

        NotificationService.connectWebSocket(sellerId);

        expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:8080/notifications/' + sellerId);

        var mockData = { message: 'New order received', type: 'success' };
        mockWebSocket.onmessage({ data: JSON.stringify(mockData) });

        $rootScope.$apply();

        expect(NotificationService.showNotification).toHaveBeenCalledWith(mockData.message, mockData.type);
      });

      it('should not create duplicate WebSocket connection', function() {
        var sellerId = 'seller123';
        var mockWebSocket = {
          onmessage: null,
          onerror: null,
          close: jasmine.createSpy('close')
        };

        spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);

        NotificationService.connectWebSocket(sellerId);
        NotificationService.connectWebSocket(sellerId);

        expect(window.WebSocket.calls.count()).toBe(1);
      });
    });

    describe('disconnectWebSocket', function() {
      it('should close WebSocket connection', function() {
        var sellerId = 'seller123';
        var mockWebSocket = {
          onmessage: null,
          onerror: null,
          close: jasmine.createSpy('close')
        };

        spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);

        NotificationService.connectWebSocket(sellerId);
        NotificationService.disconnectWebSocket();

        expect(mockWebSocket.close).toHaveBeenCalled();
      });

      it('should handle disconnection when no WebSocket exists', function() {
        expect(function() {
          NotificationService.disconnectWebSocket();
        }).not.toThrow();
      });
    });
  });
})();