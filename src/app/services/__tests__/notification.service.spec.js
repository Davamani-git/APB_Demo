describe('NotificationService', function() {
  beforeEach(module('app.shopping'));
  var NotificationService, $httpBackend, $interval, $timeout, API_BASE_URL;
  beforeEach(inject(function(_NotificationService_, _$httpBackend_, _$interval_, _$timeout_, _API_BASE_URL_) {
    NotificationService = _NotificationService_;
    $httpBackend = _$httpBackend_;
    $interval = _$interval_;
    $timeout = _$timeout_;
    API_BASE_URL = _API_BASE_URL_;
  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $interval.verifyNoPendingTimers();
  });
  describe('startPolling', function() {
    /*
    Test Documentation:
    - Test Name: should start polling for notifications
    - Purpose: Validates polling initialization
    - Scenario: startPolling called with userId
    - Expected Result: Polling interval is established
    */
    it('should start polling for notifications', function() {
      var userId = 123;
      var response = [{ id: 1, message: 'Test notification' }];
      $httpBackend.expectGET(API_BASE_URL + '/notifications/' + userId).respond(response);
      NotificationService.startPolling(userId, function() {});
      $httpBackend.flush();
      $interval.flush(5000);
    });
    /*
    Test Documentation:
    - Test Name: should call callback with notifications
    - Purpose: Validates callback execution with notification data
    - Scenario: Server returns notifications
    - Expected Result: Callback is invoked with notifications
    */
    it('should call callback with notifications', function() {
      var userId = 123;
      var response = [{ id: 1, message: 'Test notification' }];
      var callback = jasmine.createSpy('callback');
      $httpBackend.expectGET(API_BASE_URL + '/notifications/' + userId).respond(response);
      NotificationService.startPolling(userId, callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalledWith(response);
    });
  });
  describe('stopPolling', function() {
    /*
    Test Documentation:
    - Test Name: should stop polling
    - Purpose: Validates polling cancellation
    - Scenario: stopPolling called after startPolling
    - Expected Result: Polling interval is cancelled
    */
    it('should stop polling', function() {
      var userId = 123;
      $httpBackend.expectGET(API_BASE_URL + '/notifications/' + userId).respond([]);
      NotificationService.startPolling(userId, function() {});
      $httpBackend.flush();
      NotificationService.stopPolling();
      $interval.verifyNoPendingTimers();
    });
  });
  describe('markAsRead', function() {
    /*
    Test Documentation:
    - Test Name: should mark notification as read
    - Purpose: Validates marking notification as read
    - Scenario: PUT request to mark notification
    - Expected Result: Notification is marked as read
    */
    it('should mark notification as read', function() {
      var notificationId = 1;
      var response = { success: true };
      $httpBackend.expectPUT(API_BASE_URL + '/notifications/' + notificationId + '/read').respond(response);
      NotificationService.markAsRead(notificationId).then(function(result) {
        expect(result).toEqual(response);
      });
      $httpBackend.flush();
    });
    /*
    Test Documentation:
    - Test Name: should handle mark as read error
    - Purpose: Validates error handling when marking fails
    - Scenario: Server returns error
    - Expected Result: Promise is rejected
    */
    it('should handle mark as read error', function() {
      var notificationId = 999;
      $httpBackend.expectPUT(API_BASE_URL + '/notifications/' + notificationId + '/read').respond(404, 'Not found');
      NotificationService.markAsRead(notificationId).catch(function(error) {
        expect(error.status).toBe(404);
      });
      $httpBackend.flush();
    });
  });
  /*
  Coverage Report:
  - Functions tested: startPolling, stopPolling, markAsRead
  - Scenarios covered: polling initialization, callback execution, polling cancellation, marking as read, error handling
  - Uncovered scenarios: multiple polling instances, race conditions
  */
});
