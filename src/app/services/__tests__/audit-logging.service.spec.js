/*
Test Documentation:
- Test Name: AuditLoggingService - logEvent success
- Purpose: Verify logEvent constructs correct event and posts to /api/audit/events
- Scenario: $http.post resolves with data
- Expected Result: Returns response.data

- Test Name: AuditLoggingService - logEvent failure
- Purpose: Verify logEvent handles HTTP error gracefully
- Scenario: $http.post rejects
- Expected Result: console.error is called

- Test Name: AuditLoggingService - generateEventId format
- Purpose: Verify generateEventId returns a string starting with 'evt_'
- Scenario: Called directly
- Expected Result: Returns string matching 'evt_<timestamp>_<random>'

- Test Name: AuditLoggingService - getCurrentUserId with sessionStorage value
- Purpose: Verify it returns userId from sessionStorage
- Scenario: sessionStorage has userId set
- Expected Result: Returns the stored userId

- Test Name: AuditLoggingService - getCurrentUserId without sessionStorage value
- Purpose: Verify it returns 'anonymous' when sessionStorage is empty
- Scenario: sessionStorage has no userId
- Expected Result: Returns 'anonymous'

- Test Name: AuditLoggingService - getCurrentSessionId with sessionStorage value
- Purpose: Verify it returns sessionId from sessionStorage
- Scenario: sessionStorage has sessionId set
- Expected Result: Returns the stored sessionId

- Test Name: AuditLoggingService - getCurrentSessionId without sessionStorage value
- Purpose: Verify it returns 'unknown' when sessionStorage is empty
- Scenario: sessionStorage has no sessionId
- Expected Result: Returns 'unknown'

Coverage Report:
- Functions tested: logEvent, generateEventId, getCurrentUserId, getCurrentSessionId
- Scenarios covered: success, failure, sessionStorage present, sessionStorage absent
- Uncovered scenarios: concurrent event logging
*/
describe('AuditLoggingService', function() {
  var AuditLoggingService, $httpBackend;

  beforeEach(module('app'));

  beforeEach(inject(function(_AuditLoggingService_, _$httpBackend_) {
    AuditLoggingService = _AuditLoggingService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    sessionStorage.clear();
  });

  describe('logEvent', function() {
    it('should POST to /api/audit/events and return response data on success', function() {
      var mockResponse = { success: true };
      $httpBackend.expectPOST('/api/audit/events').respond(200, mockResponse);

      var result;
      AuditLoggingService.logEvent('LOGIN', { ip: '127.0.0.1' }).then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should include eventType and metadata in the POST payload', function() {
      $httpBackend.expectPOST('/api/audit/events', function(data) {
        var parsed = JSON.parse(data);
        return parsed.eventType === 'LOGOUT' && parsed.metadata.reason === 'timeout';
      }).respond(200, {});

      AuditLoggingService.logEvent('LOGOUT', { reason: 'timeout' });
      $httpBackend.flush();
    });

    it('should call console.error when $http.post fails', function() {
      spyOn(console, 'error');
      $httpBackend.expectPOST('/api/audit/events').respond(500, {});

      AuditLoggingService.logEvent('ERROR_EVENT', {});
      $httpBackend.flush();
      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Audit event logging failed:'),
        jasmine.anything()
      );
    });

    it('should include a valid ISO timestamp in the payload', function() {
      $httpBackend.expectPOST('/api/audit/events', function(data) {
        var parsed = JSON.parse(data);
        return !isNaN(Date.parse(parsed.timestamp));
      }).respond(200, {});

      AuditLoggingService.logEvent('TEST', {});
      $httpBackend.flush();
    });
  });

  describe('generateEventId', function() {
    it('should return a string starting with evt_', function() {
      var id = AuditLoggingService.generateEventId();
      expect(typeof id).toBe('string');
      expect(id.indexOf('evt_')).toBe(0);
    });

    it('should generate unique IDs on successive calls', function() {
      var id1 = AuditLoggingService.generateEventId();
      var id2 = AuditLoggingService.generateEventId();
      expect(id1).not.toEqual(id2);
    });
  });

  describe('getCurrentUserId', function() {
    it('should return userId from sessionStorage when set', function() {
      sessionStorage.setItem('userId', 'user123');
      expect(AuditLoggingService.getCurrentUserId()).toBe('user123');
    });

    it('should return anonymous when sessionStorage has no userId', function() {
      sessionStorage.removeItem('userId');
      expect(AuditLoggingService.getCurrentUserId()).toBe('anonymous');
    });
  });

  describe('getCurrentSessionId', function() {
    it('should return sessionId from sessionStorage when set', function() {
      sessionStorage.setItem('sessionId', 'sess_abc');
      expect(AuditLoggingService.getCurrentSessionId()).toBe('sess_abc');
    });

    it('should return unknown when sessionStorage has no sessionId', function() {
      sessionStorage.removeItem('sessionId');
      expect(AuditLoggingService.getCurrentSessionId()).toBe('unknown');
    });
  });
});
