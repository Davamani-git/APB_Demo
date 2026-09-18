/*
Test Documentation:
- Test Name: auditService - logDecision success
- Purpose: Verify that logDecision builds the correct payload and posts to the audit logs endpoint.
- Scenario: Normal - call logDecision with full auditData.
- Expected Result: $http.post called with API_ENDPOINTS.auditLogs; payload contains correct fields; resolved data returned.

- Test Name: auditService - logDecision defaults userId to 'system' when not provided
- Purpose: Verify that userId defaults to 'system' when auditData.userId is absent.
- Scenario: Edge - auditData without userId.
- Expected Result: Posted payload has userId === 'system'.

- Test Name: auditService - logDecision uses provided userId
- Purpose: Verify that logDecision uses the userId from auditData when present.
- Scenario: Normal - auditData with userId.
- Expected Result: Posted payload has userId matching auditData.userId.

- Test Name: auditService - logDecision returns null on HTTP error (catch)
- Purpose: Verify that logDecision swallows HTTP errors and resolves with null.
- Scenario: Error - $http.post rejects.
- Expected Result: Promise resolves with null (not rejected).

- Test Name: auditService - logError success
- Purpose: Verify that logError posts a payload with eventType 'error' and correct error fields.
- Scenario: Normal - call logError with an error object that has config.url.
- Expected Result: $http.post called; payload has eventType 'error', correct status/statusText/url.

- Test Name: auditService - logError handles missing config (url falls back to 'unknown')
- Purpose: Verify that logError handles error objects without a config property.
- Scenario: Edge - error object without config.
- Expected Result: Posted payload has url === 'unknown'.

- Test Name: auditService - logError swallows HTTP errors silently
- Purpose: Verify that logError does not propagate rejections.
- Scenario: Error - $http.post rejects inside logError.
- Expected Result: No unhandled rejection; promise resolves or is silently swallowed.

- Test Name: auditService - getAuditLogs success
- Purpose: Verify that getAuditLogs calls $http.get with the correct endpoint and transactionId param.
- Scenario: Normal - call getAuditLogs('txn_001').
- Expected Result: $http.get called with correct URL and params; resolved data returned.

- Test Name: auditService - getAuditLogs HTTP error
- Purpose: Verify that a rejected $http.get in getAuditLogs propagates the rejection.
- Scenario: Error - $http.get rejects.
- Expected Result: Promise is rejected.

- Test Name: auditService - generateId format
- Purpose: Verify that generateId returns a string matching the expected pattern.
- Scenario: Normal - call generateId().
- Expected Result: Returned string matches /^audit_\d+_[a-z0-9]+$/.

- Test Name: auditService - generateId uniqueness
- Purpose: Verify that two consecutive calls to generateId return different values.
- Scenario: Edge - rapid successive calls.
- Expected Result: Two generated IDs are not equal.

Coverage Report:
- Functions tested: logDecision, logError, getAuditLogs, generateId
- Scenarios covered: success/normal, missing userId, missing error.config, HTTP errors (swallowed and propagated), ID uniqueness
- Uncovered scenarios: concurrent duplicate log calls, network timeout
*/

describe('auditService', function() {
  'use strict';

  var auditService;
  var $httpBackend;
  var $rootScope;
  var API_ENDPOINTS;

  var FAKE_ENDPOINTS = {
    auditLogs: '/api/audit-logs'
  };

  beforeEach(module('fraudAlertModule', function($provide) {
    $provide.constant('API_ENDPOINTS', FAKE_ENDPOINTS);
  }));

  beforeEach(inject(function(_auditService_, _$httpBackend_, _$rootScope_, _API_ENDPOINTS_) {
    auditService  = _auditService_;
    $httpBackend  = _$httpBackend_;
    $rootScope    = _$rootScope_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── logDecision ─────────────────────────────────────────────────────────────

  describe('logDecision', function() {

    it('should post to auditLogs endpoint and return resolved data on success', function() {
      var mockResponse = { logId: 'audit_001' };
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs).respond(201, mockResponse);

      var result;
      auditService.logDecision({
        transactionId: 'txn_001',
        eventType:     'fraud_alert_created',
        payload:       { riskScore: 80 },
        userId:        'user_42'
      }).then(function(data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should default userId to "system" when auditData.userId is not provided', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      auditService.logDecision({
        transactionId: 'txn_002',
        eventType:     'fraud_alert_viewed',
        payload:       {}
      });
      $httpBackend.flush();

      expect(capturedPayload.userId).toBe('system');
    });

    it('should use the provided userId from auditData', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      auditService.logDecision({
        transactionId: 'txn_003',
        eventType:     'fraud_alert_confirmed',
        payload:       {},
        userId:        'analyst_007'
      });
      $httpBackend.flush();

      expect(capturedPayload.userId).toBe('analyst_007');
    });

    it('should include transactionId, eventType, and payload in the posted body', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      auditService.logDecision({
        transactionId: 'txn_004',
        eventType:     'fraud_alert_reported',
        payload:       { reason: 'unauthorized' }
      });
      $httpBackend.flush();

      expect(capturedPayload.transactionId).toBe('txn_004');
      expect(capturedPayload.eventType).toBe('fraud_alert_reported');
      expect(capturedPayload.payload).toEqual({ reason: 'unauthorized' });
    });

    it('should resolve with null when $http.post fails (catch swallows error)', function() {
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs).respond(500, { message: 'Server Error' });

      var result = 'NOT_SET';
      auditService.logDecision({
        transactionId: 'txn_005',
        eventType:     'error',
        payload:       {}
      }).then(function(data) { result = data; });

      $httpBackend.flush();
      expect(result).toBeNull();
    });

  });

  // ─── logError ────────────────────────────────────────────────────────────────

  describe('logError', function() {

    it('should post a payload with eventType "error" and correct error fields', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      auditService.logError({
        status:     503,
        statusText: 'Service Unavailable',
        config:     { url: '/api/fraud-alerts' }
      });
      $httpBackend.flush();

      expect(capturedPayload.eventType).toBe('error');
      expect(capturedPayload.payload.status).toBe(503);
      expect(capturedPayload.payload.statusText).toBe('Service Unavailable');
      expect(capturedPayload.payload.url).toBe('/api/fraud-alerts');
      expect(capturedPayload.userId).toBe('system');
    });

    it('should use "unknown" as url when error.config is absent', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      auditService.logError({
        status:     404,
        statusText: 'Not Found'
        // no config property
      });
      $httpBackend.flush();

      expect(capturedPayload.payload.url).toBe('unknown');
    });

    it('should not propagate rejection when $http.post fails inside logError', function() {
      $httpBackend.expectPOST(FAKE_ENDPOINTS.auditLogs).respond(500, {});

      var rejected = false;
      auditService.logError({ status: 500, statusText: 'Error' })
        .catch(function() { rejected = true; });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBe(false);
    });

  });

  // ─── getAuditLogs ────────────────────────────────────────────────────────────

  describe('getAuditLogs', function() {

    it('should call $http.get with auditLogs endpoint and transactionId param', function() {
      var mockLogs = [{ logId: 'audit_001' }, { logId: 'audit_002' }];
      $httpBackend.expectGET(FAKE_ENDPOINTS.auditLogs + '?transactionId=txn_001').respond(200, mockLogs);

      var result;
      auditService.getAuditLogs('txn_001').then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockLogs);
    });

    it('should propagate rejection when $http.get fails', function() {
      $httpBackend.expectGET(FAKE_ENDPOINTS.auditLogs + '?transactionId=txn_bad').respond(500, {});

      var rejected = false;
      auditService.getAuditLogs('txn_bad').catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── generateId ──────────────────────────────────────────────────────────────

  describe('generateId', function() {

    it('should return a string matching the pattern audit_<timestamp>_<random>', function() {
      var id = auditService.generateId();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^audit_\d+_[a-z0-9]+$/);
    });

    it('should return unique IDs on successive calls', function() {
      var id1 = auditService.generateId();
      var id2 = auditService.generateId();
      expect(id1).not.toBe(id2);
    });

    it('should always start with the prefix "audit_"', function() {
      var id = auditService.generateId();
      expect(id.indexOf('audit_')).toBe(0);
    });

  });

});