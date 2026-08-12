describe('NotificationService', function() {
  beforeEach(module('onlineShoppingApp'));
  var NotificationService, $httpBackend, $q;

  beforeEach(inject(function(_NotificationService_, _$httpBackend_, _$q_) {
    NotificationService = _NotificationService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('sendNotification', function() {
    /*
    Test Documentation:
    - Test Name: should send notification with valid parameters
    - Purpose: Validates successful notification sending
    - Scenario: Call sendNotification with userId, type, and message
    - Expected Result: Promise resolves with response data
    */
    it('should send notification with valid parameters', function(done) {
      var userId = 'user123';
      var type = 'email';
      var message = 'Your order has been confirmed';
      var mockResponse = { notificationId: 'notif123', status: 'sent' };

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(200, mockResponse);

      NotificationService.sendNotification(userId, type, message).then(function(data) {
        expect(data).toEqual(mockResponse);
        expect(data.status).toBe('sent');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle SMS notification type
    - Purpose: Validates different notification types
    - Scenario: Send SMS type notification
    - Expected Result: Promise resolves with SMS notification response
    */
    it('should handle SMS notification type', function(done) {
      var userId = 'user456';
      var type = 'sms';
      var message = 'Your package is on the way';
      var mockResponse = { notificationId: 'notif456', type: 'sms', status: 'sent' };

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(200, mockResponse);

      NotificationService.sendNotification(userId, type, message).then(function(data) {
        expect(data.type).toBe('sms');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle push notification type
    - Purpose: Validates push notification handling
    - Scenario: Send push type notification
    - Expected Result: Promise resolves with push notification response
    */
    it('should handle push notification type', function(done) {
      var userId = 'user789';
      var type = 'push';
      var message = 'New discount available';
      var mockResponse = { notificationId: 'notif789', type: 'push', status: 'sent' };

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(200, mockResponse);

      NotificationService.sendNotification(userId, type, message).then(function(data) {
        expect(data.type).toBe('push');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on API error
    - Purpose: Validates error handling for failed notifications
    - Scenario: API returns error response
    - Expected Result: Promise rejects with error object
    */
    it('should reject promise on API error', function(done) {
      var userId = 'user123';
      var type = 'email';
      var message = 'Test message';
      var errorResponse = { error: 'Invalid user ID' };

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(400, errorResponse);

      NotificationService.sendNotification(userId, type, message).then(function() {
        fail('Should have rejected');
      }, function(error) {
        expect(error.status).toBe(400);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on server error
    - Purpose: Validates handling of server-side errors
    - Scenario: API returns 500 server error
    - Expected Result: Promise rejects with server error
    */
    it('should reject promise on server error', function(done) {
      var userId = 'user123';
      var type = 'email';
      var message = 'Test message';

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(500, { error: 'Internal server error' });

      NotificationService.sendNotification(userId, type, message).then(function() {
        fail('Should have rejected');
      }, function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty message
    - Purpose: Validates handling of edge case with empty message
    - Scenario: Send notification with empty message string
    - Expected Result: API call is made with empty message
    */
    it('should handle empty message', function(done) {
      var userId = 'user123';
      var type = 'email';
      var message = '';
      var mockResponse = { notificationId: 'notif999', status: 'sent' };

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(200, mockResponse);

      NotificationService.sendNotification(userId, type, message).then(function(data) {
        expect(data.status).toBe('sent');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle special characters in message
    - Purpose: Validates handling of special characters
    - Scenario: Send notification with special characters
    - Expected Result: Message is properly encoded and sent
    */
    it('should handle special characters in message', function(done) {
      var userId = 'user123';
      var type = 'email';
      var message = 'Order #123 - Price: $99.99 & Free Shipping!';
      var mockResponse = { notificationId: 'notif888', status: 'sent' };

      $httpBackend.expectPOST('/api/notifications/send', {
        userId: userId,
        type: type,
        message: message
      }).respond(200, mockResponse);

      NotificationService.sendNotification(userId, type, message).then(function(data) {
        expect(data.status).toBe('sent');
        done();
      });

      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: sendNotification
- Scenarios covered: successful notification sending, multiple notification types (email, SMS, push), error handling (400, 500), empty messages, special characters
- Edge cases covered: invalid user ID, server errors, empty message strings
- Uncovered scenarios: network timeout, concurrent notification sends, notification delivery confirmation
*/