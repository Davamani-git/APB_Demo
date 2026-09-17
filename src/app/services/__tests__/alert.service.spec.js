/*
Test Documentation:

- Test Name: AlertService - createAlert (success)
- Purpose: Verify that createAlert sets alertId, createdAt, status on the fraudAlert object, posts to /api/alerts, logs an audit event, and resolves with response data.
- Scenario: $http.post resolves successfully; AuditService.logEvent is a spy.
- Expected Result: AuditService.logEvent called with 'ALERT_CREATED' and the alert object; promise resolves with response.data.

- Test Name: AlertService - createAlert (HTTP failure)
- Purpose: Verify that when $http.post rejects, the error is re-thrown and propagates to the caller.
- Scenario: $http.post rejects with a network error object.
- Expected Result: The returned promise is rejected with the original error.

- Test Name: AlertService - createAlert sets status to PENDING
- Purpose: Confirm the status field is always initialised to 'PENDING' before the HTTP call.
- Scenario: Normal call with a minimal fraudAlert object.
- Expected Result: fraudAlert.status === 'PENDING' after createAlert is invoked.

- Test Name: AlertService - createAlert sets createdAt to a Date
- Purpose: Confirm createdAt is populated with a Date instance.
- Scenario: Normal call with a minimal fraudAlert object.
- Expected Result: fraudAlert.createdAt is an instance of Date.

- Test Name: AlertService - createAlert generates an alertId with ALT- prefix
- Purpose: Confirm the generated ID follows the ALT- naming convention.
- Scenario: Normal call with a minimal fraudAlert object.
- Expected Result: fraudAlert.alertId starts with 'ALT-'.

- Test Name: AlertService - getAlerts (success)
- Purpose: Verify that getAlerts performs a GET to /api/alerts and resolves with response.data.
- Scenario: $http.get resolves with { data: [...] }.
- Expected Result: Promise resolves with the array returned in response.data.

- Test Name: AlertService - getAlerts (HTTP failure)
- Purpose: Verify that a failed GET propagates the rejection.
- Scenario: $http.get rejects.
- Expected Result: Promise is rejected.

- Test Name: AlertService - updateAlertStatus (success)
- Purpose: Verify PATCH is sent to /api/alerts/:id with the correct status payload and resolves with response.data.
- Scenario: $http.patch resolves successfully.
- Expected Result: Promise resolves with response.data; PATCH URL contains the alertId.

- Test Name: AlertService - updateAlertStatus (HTTP failure)
- Purpose: Verify that a failed PATCH propagates the rejection.
- Scenario: $http.patch rejects.
- Expected Result: Promise is rejected.

- Test Name: AlertService - createAlert does NOT call AuditService on HTTP failure
- Purpose: Confirm audit logging is skipped when the HTTP call fails.
- Scenario: $http.post rejects.
- Expected Result: AuditService.logEvent is never called.

Coverage Report:
- Functions tested: createAlert, getAlerts, updateAlertStatus, generateId (indirectly via createAlert)
- Scenarios covered: success path, HTTP rejection, field initialisation (status, createdAt, alertId), audit logging on success, audit NOT logged on failure, PATCH URL construction
- Uncovered scenarios: concurrent calls, extremely large payloads (out of scope for unit tests)
*/

describe('AlertService', function() {
  'use strict';

  var AlertService;
  var $httpBackend;
  var AuditServiceMock;
  var $q;
  var $rootScope;

  beforeEach(module('fraudDetectionApp'));

  beforeEach(function() {
    AuditServiceMock = {
      logEvent: jasmine.createSpy('logEvent').and.returnValue(undefined)
    };

    module(function($provide) {
      $provide.value('AuditService', AuditServiceMock);
    });
  });

  beforeEach(inject(function(_AlertService_, _$httpBackend_, _$q_, _$rootScope_) {
    AlertService  = _AlertService_;
    $httpBackend  = _$httpBackend_;
    $q            = _$q_;
    $rootScope    = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ---------------------------------------------------------------------------
  // createAlert
  // ---------------------------------------------------------------------------

  describe('createAlert', function() {

    it('should set status to PENDING before posting', function() {
      var alert = { transactionId: 'TXN-001', amount: 99.99 };
      $httpBackend.expectPOST('/api/alerts').respond(200, { id: 1 });

      AlertService.createAlert(alert);
      $httpBackend.flush();

      expect(alert.status).toBe('PENDING');
    });

    it('should set createdAt to a Date instance before posting', function() {
      var alert = { transactionId: 'TXN-002' };
      $httpBackend.expectPOST('/api/alerts').respond(200, {});

      AlertService.createAlert(alert);
      $httpBackend.flush();

      expect(alert.createdAt instanceof Date).toBe(true);
    });

    it('should generate an alertId that starts with ALT-', function() {
      var alert = { transactionId: 'TXN-003' };
      $httpBackend.expectPOST('/api/alerts').respond(200, {});

      AlertService.createAlert(alert);
      $httpBackend.flush();

      expect(alert.alertId).toBeDefined();
      expect(alert.alertId.indexOf('ALT-')).toBe(0);
    });

    it('should resolve with response.data on success', function() {
      var alert = { transactionId: 'TXN-004' };
      var responsePayload = { alertId: 'ALT-123', status: 'PENDING' };
      $httpBackend.expectPOST('/api/alerts').respond(200, responsePayload);

      var resolved;
      AlertService.createAlert(alert).then(function(data) {
        resolved = data;
      });
      $httpBackend.flush();

      expect(resolved).toEqual(responsePayload);
    });

    it('should call AuditService.logEvent with ALERT_CREATED on success', function() {
      var alert = { transactionId: 'TXN-005' };
      $httpBackend.expectPOST('/api/alerts').respond(200, {});

      AlertService.createAlert(alert);
      $httpBackend.flush();

      expect(AuditServiceMock.logEvent).toHaveBeenCalledWith('ALERT_CREATED', alert);
    });

    it('should reject and NOT call AuditService.logEvent when $http.post fails', function() {
      var alert = { transactionId: 'TXN-006' };
      $httpBackend.expectPOST('/api/alerts').respond(500, { message: 'Server Error' });

      var rejected;
      AlertService.createAlert(alert).catch(function(err) {
        rejected = err;
      });
      $httpBackend.flush();

      expect(rejected).toBeDefined();
      expect(AuditServiceMock.logEvent).not.toHaveBeenCalled();
    });

    it('should re-throw the error so the caller receives the rejection', function() {
      var alert = { transactionId: 'TXN-007' };
      $httpBackend.expectPOST('/api/alerts').respond(503, {});

      var caughtError = null;
      AlertService.createAlert(alert).catch(function(err) {
        caughtError = err;
      });
      $httpBackend.flush();

      expect(caughtError).not.toBeNull();
    });

    it('should post to /api/alerts endpoint', function() {
      var alert = { transactionId: 'TXN-008' };
      $httpBackend.expectPOST('/api/alerts').respond(200, {});

      AlertService.createAlert(alert);
      $httpBackend.flush();
      // verifyNoOutstandingExpectation in afterEach confirms the POST was made
    });

    it('should generate unique alertIds for successive calls', function() {
      var alert1 = { transactionId: 'TXN-009' };
      var alert2 = { transactionId: 'TXN-010' };
      $httpBackend.expectPOST('/api/alerts').respond(200, {});
      AlertService.createAlert(alert1);
      $httpBackend.flush();

      $httpBackend.expectPOST('/api/alerts').respond(200, {});
      AlertService.createAlert(alert2);
      $httpBackend.flush();

      expect(alert1.alertId).not.toEqual(alert2.alertId);
    });
  });

  // ---------------------------------------------------------------------------
  // getAlerts
  // ---------------------------------------------------------------------------

  describe('getAlerts', function() {

    it('should resolve with response.data on success', function() {
      var mockAlerts = [{ alertId: 'ALT-1' }, { alertId: 'ALT-2' }];
      $httpBackend.expectGET('/api/alerts').respond(200, mockAlerts);

      var result;
      AlertService.getAlerts().then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(mockAlerts);
    });

    it('should resolve with an empty array when the server returns []', function() {
      $httpBackend.expectGET('/api/alerts').respond(200, []);

      var result;
      AlertService.getAlerts().then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should reject when the server returns a 500 error', function() {
      $httpBackend.expectGET('/api/alerts').respond(500, {});

      var rejected = false;
      AlertService.getAlerts().catch(function() {
        rejected = true;
      });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

    it('should reject when the server returns a 404 error', function() {
      $httpBackend.expectGET('/api/alerts').respond(404, {});

      var rejected = false;
      AlertService.getAlerts().catch(function() {
        rejected = true;
      });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // updateAlertStatus
  // ---------------------------------------------------------------------------

  describe('updateAlertStatus', function() {

    it('should send a PATCH to /api/alerts/:alertId with the status payload', function() {
      $httpBackend.expectPATCH('/api/alerts/ALT-999', { status: 'CONFIRMED' }).respond(200, { status: 'CONFIRMED' });

      AlertService.updateAlertStatus('ALT-999', 'CONFIRMED');
      $httpBackend.flush();
    });

    it('should resolve with response.data on success', function() {
      var responsePayload = { alertId: 'ALT-999', status: 'CONFIRMED' };
      $httpBackend.expectPATCH('/api/alerts/ALT-999').respond(200, responsePayload);

      var result;
      AlertService.updateAlertStatus('ALT-999', 'CONFIRMED').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(responsePayload);
    });

    it('should reject when the server returns a 404', function() {
      $httpBackend.expectPATCH('/api/alerts/ALT-MISSING').respond(404, {});

      var rejected = false;
      AlertService.updateAlertStatus('ALT-MISSING', 'REPORTED').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

    it('should reject when the server returns a 500', function() {
      $httpBackend.expectPATCH('/api/alerts/ALT-ERR').respond(500, {});

      var rejected = false;
      AlertService.updateAlertStatus('ALT-ERR', 'PENDING').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

    it('should correctly construct the URL for any given alertId', function() {
      var alertId = 'ALT-20260817-abc123xyz';
      $httpBackend.expectPATCH('/api/alerts/' + alertId).respond(200, {});

      AlertService.updateAlertStatus(alertId, 'RESOLVED');
      $httpBackend.flush();
    });

    it('should send status REPORTED in the PATCH body', function() {
      $httpBackend.expectPATCH('/api/alerts/ALT-001', { status: 'REPORTED' }).respond(200, {});

      AlertService.updateAlertStatus('ALT-001', 'REPORTED');
      $httpBackend.flush();
    });

    it('should send status EXPIRED in the PATCH body', function() {
      $httpBackend.expectPATCH('/api/alerts/ALT-002', { status: 'EXPIRED' }).respond(200, {});

      AlertService.updateAlertStatus('ALT-002', 'EXPIRED');
      $httpBackend.flush();
    });
  });
});
