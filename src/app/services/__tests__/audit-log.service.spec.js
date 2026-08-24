/*
Test Documentation:
- Test Name: AuditLogService - logEvent (success)
- Purpose: Verify that logEvent creates a log entry, pushes to localLogs, calls AnalyticsTrackerFactory.trackEvent, and posts to /api/audit/log.
- Scenario: $http.post resolves successfully
- Expected Result: response.data returned, AnalyticsTrackerFactory.trackEvent called with correct args

- Test Name: AuditLogService - logEvent (HTTP failure)
- Purpose: Verify that logEvent resolves gracefully with error info when HTTP call fails.
- Scenario: $http.post rejects
- Expected Result: Promise resolves with { error: 'Audit log failed', logged: false }

- Test Name: AuditLogService - logEvent (log entry structure)
- Purpose: Verify that the log entry contains all required fields including eventId, eventType, eventData, timestamp, source.
- Scenario: logEvent called with specific eventType and eventData
- Expected Result: POST body contains all required fields with correct values

- Test Name: AuditLogService - getAuditLogs (success)
- Purpose: Verify that getAuditLogs fetches from /api/audit/logs with provided filters.
- Scenario: $http.get resolves
- Expected Result: response.data returned

- Test Name: AuditLogService - getAuditLogs (HTTP failure fallback)
- Purpose: Verify that getAuditLogs returns localLogs when HTTP call fails.
- Scenario: $http.get rejects
- Expected Result: localLogs array returned as fallback

- Test Name: AuditLogService - logDecision
- Purpose: Verify that logDecision calls logEvent with 'risk_decision' eventType and correct data.
- Scenario: Valid transactionId and decision provided
- Expected Result: logEvent called internally with risk_decision type

- Test Name: AuditLogService - logEvent source field
- Purpose: Verify that all log entries include source: 'fraud-detection-ui'.
- Scenario: logEvent called
- Expected Result: POST body contains source: 'fraud-detection-ui'
*/

describe('AuditLogService', function() {
  var AuditLogService;
  var $httpBackend;
  var $rootScope;
  var AnalyticsTrackerFactory;

  beforeEach(module('fraudDetection'));

  beforeEach(function() {
    AnalyticsTrackerFactory = jasmine.createSpyObj('AnalyticsTrackerFactory', ['trackEvent']);
    AnalyticsTrackerFactory.trackEvent.and.returnValue({ then: function() {} });
    module(function($provide) {
      $provide.value('AnalyticsTrackerFactory', AnalyticsTrackerFactory);
    });
  });

  beforeEach(inject(function(_AuditLogService_, _$httpBackend_, _$rootScope_) {
    AuditLogService = _AuditLogService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('logEvent', function() {
    it('should post to /api/audit/log with correct structure', function() {
      $httpBackend.expectPOST('/api/audit/log', jasmine.objectContaining({
        eventType: 'fraud_alert_created',
        eventData: { alertId: 'ALT-001' },
        source: 'fraud-detection-ui'
      })).respond(200, { logged: true });
      var result;
      AuditLogService.logEvent('fraud_alert_created', { alertId: 'ALT-001' }).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result).toEqual({ logged: true });
    });

    it('should include eventId and timestamp in log entry', function() {
      $httpBackend.expectPOST('/api/audit/log', jasmine.objectContaining({
        eventId: jasmine.stringMatching(/^EVT-/),
        timestamp: jasmine.any(Object)
      })).respond(200, {});
      AuditLogService.logEvent('transaction_processed', { transactionId: 'TXN-001' });
      $httpBackend.flush();
    });

    it('should call AnalyticsTrackerFactory.trackEvent with same parameters', function() {
      $httpBackend.expectPOST('/api/audit/log').respond(200, {});
      AuditLogService.logEvent('alert_acknowledged', { alertId: 'ALT-002' });
      $httpBackend.flush();
      expect(AnalyticsTrackerFactory.trackEvent).toHaveBeenCalledWith('alert_acknowledged', { alertId: 'ALT-002' });
    });

    it('should resolve with error info on HTTP failure', function() {
      $httpBackend.expectPOST('/api/audit/log').respond(500, { error: 'Server Error' });
      var result;
      AuditLogService.logEvent('alert_failed', {}).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual({ error: 'Audit log failed', logged: false });
    });

    it('should include source field as fraud-detection-ui', function() {
      $httpBackend.expectPOST('/api/audit/log', jasmine.objectContaining({
        source: 'fraud-detection-ui'
      })).respond(200, {});
      AuditLogService.logEvent('user_login', { userId: 'USR-001' });
      $httpBackend.flush();
    });
  });

  describe('getAuditLogs', function() {
    it('should fetch from /api/audit/logs with filters', function() {
      var filters = { eventType: 'fraud_alert_created', startDate: '2024-01-01' };
      $httpBackend.expectGET('/api/audit/logs?eventType=fraud_alert_created&startDate=2024-01-01').respond(200, [{ eventId: 'EVT-001' }]);
      var result;
      AuditLogService.getAuditLogs(filters).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result).toEqual([{ eventId: 'EVT-001' }]);
    });

    it('should return localLogs on HTTP failure', function() {
      $httpBackend.expectPOST('/api/audit/log').respond(200, {});
      AuditLogService.logEvent('test_event', { data: 'test' });
      $httpBackend.flush();

      $httpBackend.expectGET('/api/audit/logs').respond(500, {});
      var result;
      AuditLogService.getAuditLogs({}).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('logDecision', function() {
    it('should call logEvent with risk_decision eventType', function() {
      spyOn(AuditLogService, 'logEvent').and.returnValue({ then: function() {} });
      var decision = { action: 'approve', riskLevel: 'low' };
      AuditLogService.logDecision('TXN-001', decision);
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('risk_decision', {
        transactionId: 'TXN-001',
        decision: decision
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: logEvent, getAuditLogs, logDecision
  - Scenarios covered: successful logging, HTTP failure graceful degradation, log entry structure validation,
    analytics integration, audit logs retrieval with filters, fallback to localLogs, decision logging
  - Uncovered scenarios: very large eventData payloads, concurrent logging operations
  */
});
