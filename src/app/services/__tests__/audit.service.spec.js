/*
Test Documentation:

- Test Name: AuditService - logEvent (success)
- Purpose: Verify that logEvent constructs a valid audit record and POSTs it to /api/audit, resolving with response.data.
- Scenario: $http.post resolves successfully.
- Expected Result: Promise resolves with response.data; POST body contains eventType, payload, transactionId, recordId, and timestamp.

- Test Name: AuditService - logEvent sets transactionId from payload
- Purpose: Confirm that when payload.transactionId is present it is copied to the audit record.
- Scenario: Payload contains transactionId: 'TXN-XYZ'.
- Expected Result: The POSTed body has transactionId: 'TXN-XYZ'.

- Test Name: AuditService - logEvent sets transactionId to null when absent
- Purpose: Confirm that when payload has no transactionId the audit record uses null.
- Scenario: Payload does not contain transactionId.
- Expected Result: The POSTed body has transactionId: null.

- Test Name: AuditService - logEvent generates a recordId with AUD- prefix
- Purpose: Confirm the generated ID follows the AUD- naming convention.
- Scenario: Normal logEvent call.
- Expected Result: The POSTed body has a recordId starting with 'AUD-'.

- Test Name: AuditService - logEvent sets a timestamp
- Purpose: Confirm the audit record includes a timestamp.
- Scenario: Normal logEvent call.
- Expected Result: The POSTed body has a truthy timestamp field.

- Test Name: AuditService - logEvent returns null on HTTP failure (swallows error)
- Purpose: Verify that a failed POST does not propagate the rejection; instead the promise resolves with null.
- Scenario: $http.post rejects with a 500 error.
- Expected Result: Promise resolves with null (error is swallowed).

- Test Name: AuditService - logEvent posts to /api/audit
- Purpose: Confirm the correct endpoint is used.
- Scenario: Normal logEvent call.
- Expected Result: POST is made to /api/audit.

- Test Name: AuditService - logEvent generates unique recordIds for successive calls
- Purpose: Confirm each audit record has a distinct ID.
- Scenario: Two successive logEvent calls.
- Expected Result: The two recordIds are not equal.

- Test Name: AuditService - logEvent with empty payload
- Purpose: Confirm the service handles an empty payload object without throwing.
- Scenario: logEvent called with an empty object {}.
- Expected Result: POST is made; transactionId is null.

- Test Name: AuditService - logEvent with null payload transactionId
- Purpose: Confirm explicit null transactionId in payload is handled.
- Scenario: payload.transactionId is explicitly null.
- Expected Result: audit record transactionId is null.

Coverage Report:
- Functions tested: logEvent, generateId (indirectly)
- Scenarios covered: success path, HTTP 500 failure (error swallowed → null), transactionId present, transactionId absent, transactionId explicitly null, empty payload, recordId prefix, timestamp presence, unique IDs, correct endpoint
- Uncovered scenarios: concurrent calls, payload with circular references (out of scope)
*/

describe('AuditService', function() {
  'use strict';

  var AuditService;
  var $httpBackend;
  var $rootScope;

  beforeEach(module('fraudDetectionApp'));

  beforeEach(inject(function(_AuditService_, _$httpBackend_, _$rootScope_) {
    AuditService  = _AuditService_;
    $httpBackend  = _$httpBackend_;
    $rootScope    = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ---------------------------------------------------------------------------
  // logEvent
  // ---------------------------------------------------------------------------

  describe('logEvent', function() {

    it('should POST to /api/audit', function() {
      $httpBackend.expectPOST('/api/audit').respond(200, {});

      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-001' });
      $httpBackend.flush();
    });

    it('should resolve with response.data on success', function() {
      var serverResponse = { saved: true };
      $httpBackend.expectPOST('/api/audit').respond(200, serverResponse);

      var result;
      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-002' }).then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(serverResponse);
    });

    it('should include the correct eventType in the POST body', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return parsed.eventType === 'TRANSACTION_FLAGGED';
      }).respond(200, {});

      AuditService.logEvent('TRANSACTION_FLAGGED', { transactionId: 'TXN-003' });
      $httpBackend.flush();
    });

    it('should copy transactionId from payload when present', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return parsed.transactionId === 'TXN-XYZ';
      }).respond(200, {});

      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-XYZ' });
      $httpBackend.flush();
    });

    it('should set transactionId to null when payload has no transactionId', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return parsed.transactionId === null;
      }).respond(200, {});

      AuditService.logEvent('ALERT_CREATED', { amount: 50 });
      $httpBackend.flush();
    });

    it('should set transactionId to null when payload.transactionId is explicitly null', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return parsed.transactionId === null;
      }).respond(200, {});

      AuditService.logEvent('ALERT_CREATED', { transactionId: null });
      $httpBackend.flush();
    });

    it('should generate a recordId that starts with AUD-', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return typeof parsed.recordId === 'string' && parsed.recordId.indexOf('AUD-') === 0;
      }).respond(200, {});

      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-005' });
      $httpBackend.flush();
    });

    it('should include a truthy timestamp in the POST body', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return !!parsed.timestamp;
      }).respond(200, {});

      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-006' });
      $httpBackend.flush();
    });

    it('should include the full payload object in the POST body', function() {
      var payload = { transactionId: 'TXN-007', amount: 250.00, merchant: 'TestMerchant' };
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return parsed.payload.transactionId === 'TXN-007' &&
               parsed.payload.amount === 250.00 &&
               parsed.payload.merchant === 'TestMerchant';
      }).respond(200, {});

      AuditService.logEvent('ALERT_CREATED', payload);
      $httpBackend.flush();
    });

    it('should resolve with null (swallow error) when $http.post fails with 500', function() {
      $httpBackend.expectPOST('/api/audit').respond(500, { message: 'Internal Server Error' });

      var result = 'NOT_SET';
      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-008' }).then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toBeNull();
    });

    it('should resolve with null (swallow error) when $http.post fails with 503', function() {
      $httpBackend.expectPOST('/api/audit').respond(503, {});

      var result = 'NOT_SET';
      AuditService.logEvent('ALERT_CREATED', { transactionId: 'TXN-009' }).then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toBeNull();
    });

    it('should generate unique recordIds for two successive calls', function() {
      var firstRecordId;
      var secondRecordId;

      $httpBackend.expectPOST('/api/audit', function(body) {
        firstRecordId = JSON.parse(body).recordId;
        return true;
      }).respond(200, {});
      AuditService.logEvent('EVT_A', { transactionId: 'TXN-010' });
      $httpBackend.flush();

      $httpBackend.expectPOST('/api/audit', function(body) {
        secondRecordId = JSON.parse(body).recordId;
        return true;
      }).respond(200, {});
      AuditService.logEvent('EVT_B', { transactionId: 'TXN-011' });
      $httpBackend.flush();

      expect(firstRecordId).not.toEqual(secondRecordId);
    });

    it('should handle an empty payload object without throwing', function() {
      $httpBackend.expectPOST('/api/audit', function(body) {
        var parsed = JSON.parse(body);
        return parsed.transactionId === null;
      }).respond(200, {});

      expect(function() {
        AuditService.logEvent('ALERT_CREATED', {});
        $httpBackend.flush();
      }).not.toThrow();
    });
  });
});
