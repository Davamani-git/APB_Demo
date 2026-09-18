/*
Test Documentation:

- Test Name: AuditService - log() should build correct audit entry and POST to auditUrl
- Purpose: Verify that log() constructs a valid audit entry with all required fields and calls $http.post with the correct URL.
- Scenario: Normal - valid event object with type, data, and user provided.
- Expected Result: $http.post is called with API_CONFIG.auditUrl and a correctly shaped auditEntry; resolves with response.data.

- Test Name: AuditService - log() should default user to 'system' when not provided
- Purpose: Ensure the user field defaults to 'system' when the event object omits the user property.
- Scenario: Edge - event object has no user field.
- Expected Result: The posted auditEntry.user equals 'system'.

- Test Name: AuditService - log() should log info on success
- Purpose: Confirm $log.info is called with the event type after a successful POST.
- Scenario: Normal - $http.post resolves successfully.
- Expected Result: $log.info is called once with 'Audit logged:' and the event type.

- Test Name: AuditService - log() should log error and rethrow on failure
- Purpose: Confirm $log.error is called and the error is rethrown when $http.post rejects.
- Scenario: Error - $http.post rejects with an error object.
- Expected Result: $log.error is called; the returned promise rejects with the same error.

- Test Name: AuditService - log() should include a valid ISO timestamp
- Purpose: Verify the timestamp field in the audit entry is a valid ISO 8601 string.
- Scenario: Normal - log() is called at any time.
- Expected Result: auditEntry.timestamp matches ISO 8601 format.

- Test Name: AuditService - logDecision() should delegate to log() with type 'policy_decision'
- Purpose: Ensure logDecision() calls log() with the correct event shape.
- Scenario: Normal - a decision object is passed.
- Expected Result: $http.post is called; posted entry has event_type 'policy_decision' and event_data equal to the decision.

- Test Name: AuditService - logAlertCreation() should delegate to log() with type 'alert_created'
- Purpose: Ensure logAlertCreation() calls log() with the correct event shape.
- Scenario: Normal - an alert object is passed.
- Expected Result: $http.post is called; posted entry has event_type 'alert_created' and event_data equal to the alert.

- Test Name: AuditService - logStateTransition() should delegate to log() with type 'state_transition'
- Purpose: Ensure logStateTransition() calls log() with entity, fromState, and toState wrapped correctly.
- Scenario: Normal - entity string, fromState, and toState are provided.
- Expected Result: $http.post is called; posted entry has event_type 'state_transition' and event_data containing entity, from, and to fields.

- Test Name: AuditService - logStateTransition() should handle empty string states
- Purpose: Verify that empty string values for fromState and toState are accepted without error.
- Scenario: Edge - fromState and toState are empty strings.
- Expected Result: $http.post is called without throwing; event_data.from and event_data.to are empty strings.

- Test Name: AuditService - log() should handle null event data gracefully
- Purpose: Ensure log() does not throw when event.data is null.
- Scenario: Edge - event.data is null.
- Expected Result: $http.post is still called; auditEntry.event_data is null.

Coverage Report:
- Functions tested: log, logDecision, logAlertCreation, logStateTransition
- Scenarios covered: normal POST success, default user, $log.info on success, $log.error + rethrow on failure, ISO timestamp, logDecision delegation, logAlertCreation delegation, logStateTransition delegation, empty state strings, null event data
- Uncovered scenarios: network timeout (indistinguishable from rejection in $http), concurrent calls
*/

(function() {
  'use strict';

  describe('AuditService', function() {

    var AuditService;
    var $http;
    var $log;
    var $q;
    var $rootScope;
    var API_CONFIG;
    var httpDeferred;

    beforeEach(module('fraudDetectionApp'));

    beforeEach(module(function($provide) {
      API_CONFIG = { auditUrl: '/api/audit', authUrl: '/api/auth' };
      $provide.constant('API_CONFIG', API_CONFIG);
    }));

    beforeEach(inject(function(_AuditService_, _$httpBackend_, _$log_, _$q_, _$rootScope_) {
      AuditService = _AuditService_;
      $log = _$log_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    beforeEach(inject(function($httpBackend) {
      $http = $httpBackend;
    }));

    afterEach(inject(function($httpBackend) {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));

    // ─── log() ───────────────────────────────────────────────────────────────

    describe('log()', function() {

      it('should build correct audit entry and POST to auditUrl', inject(function($httpBackend) {
        var event = { type: 'test_event', data: { foo: 'bar' }, user: 'alice' };
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, { id: 1 });

        AuditService.log(event);
        $httpBackend.flush();

        expect(postedBody.event_type).toBe('test_event');
        expect(postedBody.event_data).toEqual({ foo: 'bar' });
        expect(postedBody.user).toBe('alice');
        expect(postedBody.timestamp).toBeDefined();
      }));

      it('should default user to "system" when not provided', inject(function($httpBackend) {
        var event = { type: 'no_user_event', data: {} };
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        AuditService.log(event);
        $httpBackend.flush();

        expect(postedBody.user).toBe('system');
      }));

      it('should include a valid ISO 8601 timestamp', inject(function($httpBackend) {
        var event = { type: 'ts_event', data: {} };
        var postedBody;
        var isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        AuditService.log(event);
        $httpBackend.flush();

        expect(isoRegex.test(postedBody.timestamp)).toBe(true);
      }));

      it('should call $log.info on successful POST', inject(function($httpBackend) {
        spyOn($log, 'info');
        var event = { type: 'success_event', data: {} };

        $httpBackend.expectPOST('/api/audit').respond(200, { id: 42 });

        AuditService.log(event);
        $httpBackend.flush();

        expect($log.info).toHaveBeenCalledWith('Audit logged:', 'success_event');
      }));

      it('should resolve with response.data on success', inject(function($httpBackend) {
        var event = { type: 'resolve_event', data: {} };
        var result;

        $httpBackend.expectPOST('/api/audit').respond(200, { id: 99 });

        AuditService.log(event).then(function(data) { result = data; });
        $httpBackend.flush();

        expect(result).toEqual({ id: 99 });
      }));

      it('should call $log.error and rethrow on POST failure', inject(function($httpBackend) {
        spyOn($log, 'error');
        var event = { type: 'fail_event', data: {} };
        var caughtError;

        $httpBackend.expectPOST('/api/audit').respond(500, { message: 'Internal Server Error' });

        AuditService.log(event).catch(function(err) { caughtError = err; });
        $httpBackend.flush();

        expect($log.error).toHaveBeenCalled();
        expect(caughtError).toBeDefined();
      }));

      it('should handle null event.data gracefully', inject(function($httpBackend) {
        var event = { type: 'null_data_event', data: null };
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        expect(function() {
          AuditService.log(event);
          $httpBackend.flush();
        }).not.toThrow();

        expect(postedBody.event_data).toBeNull();
      }));

    });

    // ─── logDecision() ───────────────────────────────────────────────────────

    describe('logDecision()', function() {

      it('should call log() with event type "policy_decision" and the decision as data', inject(function($httpBackend) {
        var decision = { decision_id: 'D001', risk_score: 0.85, decision: 'alert' };
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        AuditService.logDecision(decision);
        $httpBackend.flush();

        expect(postedBody.event_type).toBe('policy_decision');
        expect(postedBody.event_data).toEqual(decision);
        expect(postedBody.user).toBe('system');
      }));

      it('should return a promise that resolves on success', inject(function($httpBackend) {
        var decision = { decision_id: 'D002' };
        var resolved = false;

        $httpBackend.expectPOST('/api/audit').respond(200, {});

        AuditService.logDecision(decision).then(function() { resolved = true; });
        $httpBackend.flush();

        expect(resolved).toBe(true);
      }));

      it('should reject the promise when POST fails', inject(function($httpBackend) {
        spyOn($log, 'error');
        var decision = { decision_id: 'D003' };
        var rejected = false;

        $httpBackend.expectPOST('/api/audit').respond(503, {});

        AuditService.logDecision(decision).catch(function() { rejected = true; });
        $httpBackend.flush();

        expect(rejected).toBe(true);
      }));

    });

    // ─── logAlertCreation() ──────────────────────────────────────────────────

    describe('logAlertCreation()', function() {

      it('should call log() with event type "alert_created" and the alert as data', inject(function($httpBackend) {
        var alert = { alert_id: 'A001', severity: 'high', status: 'Created' };
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        AuditService.logAlertCreation(alert);
        $httpBackend.flush();

        expect(postedBody.event_type).toBe('alert_created');
        expect(postedBody.event_data).toEqual(alert);
        expect(postedBody.user).toBe('system');
      }));

      it('should resolve with response.data on success', inject(function($httpBackend) {
        var alert = { alert_id: 'A002' };
        var result;

        $httpBackend.expectPOST('/api/audit').respond(200, { logged: true });

        AuditService.logAlertCreation(alert).then(function(data) { result = data; });
        $httpBackend.flush();

        expect(result).toEqual({ logged: true });
      }));

      it('should reject and log error when POST fails', inject(function($httpBackend) {
        spyOn($log, 'error');
        var alert = { alert_id: 'A003' };
        var rejected = false;

        $httpBackend.expectPOST('/api/audit').respond(400, {});

        AuditService.logAlertCreation(alert).catch(function() { rejected = true; });
        $httpBackend.flush();

        expect(rejected).toBe(true);
        expect($log.error).toHaveBeenCalled();
      }));

    });

    // ─── logStateTransition() ────────────────────────────────────────────────

    describe('logStateTransition()', function() {

      it('should call log() with event type "state_transition" and correct data shape', inject(function($httpBackend) {
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        AuditService.logStateTransition('alert:A001', 'Created', 'Delivered');
        $httpBackend.flush();

        expect(postedBody.event_type).toBe('state_transition');
        expect(postedBody.event_data.entity).toBe('alert:A001');
        expect(postedBody.event_data.from).toBe('Created');
        expect(postedBody.event_data.to).toBe('Delivered');
        expect(postedBody.user).toBe('system');
      }));

      it('should handle empty string states without throwing', inject(function($httpBackend) {
        var postedBody;

        $httpBackend
          .expectPOST('/api/audit', function(body) {
            postedBody = angular.fromJson(body);
            return true;
          })
          .respond(200, {});

        expect(function() {
          AuditService.logStateTransition('alert:A002', '', '');
          $httpBackend.flush();
        }).not.toThrow();

        expect(postedBody.event_data.from).toBe('');
        expect(postedBody.event_data.to).toBe('');
      }));

      it('should cover all defined alert states as valid transitions', inject(function($httpBackend) {
        var states = ['Created', 'Queued', 'Delivered', 'Viewed', 'Confirmed', 'Reported', 'Protected', 'Resolved', 'Expired'];

        for (var i = 0; i < states.length - 1; i++) {
          $httpBackend.expectPOST('/api/audit').respond(200, {});
          AuditService.logStateTransition('alert:X', states[i], states[i + 1]);
        }

        $httpBackend.flush();
      }));

      it('should reject and log error when POST fails during state transition', inject(function($httpBackend) {
        spyOn($log, 'error');
        var rejected = false;

        $httpBackend.expectPOST('/api/audit').respond(500, {});

        AuditService.logStateTransition('alert:A003', 'Queued', 'Delivered').catch(function() { rejected = true; });
        $httpBackend.flush();

        expect(rejected).toBe(true);
        expect($log.error).toHaveBeenCalled();
      }));

    });

  });

})();
