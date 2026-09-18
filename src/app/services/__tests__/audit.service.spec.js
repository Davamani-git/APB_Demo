/*
Test Documentation:
- Test Name: AuditService - logDecision (success)
- Purpose: Verify that logDecision posts a correctly structured audit record and returns response data.
- Scenario: Valid transaction, decision, and riskScore provided; $http.post succeeds.
- Expected Result: Promise resolves with response.data.

- Test Name: AuditService - logDecision (HTTP failure)
- Purpose: Verify that logDecision returns null on HTTP error.
- Scenario: $http.post rejects with an error.
- Expected Result: Resolved value is null.

- Test Name: AuditService - logDecision (correct audit record fields)
- Purpose: Verify that logDecision constructs the audit record with all required fields.
- Scenario: transaction has transaction_id and account_id; decision is 'approve'; riskScore is 72.
- Expected Result: Posted body contains transaction_id, account_id, decision, risk_score, event_type='fraud_decision', and a valid timestamp.

- Test Name: AuditService - logDecision (uses Authorization header)
- Purpose: Verify that logDecision attaches the Bearer token from localStorage.
- Scenario: localStorage contains authToken 'audit-token-001'.
- Expected Result: $http.post header Authorization equals 'Bearer audit-token-001'.

- Test Name: AuditService - logDecision (empty authToken fallback)
- Purpose: Verify that logDecision uses empty string when localStorage has no authToken.
- Scenario: localStorage.getItem returns null.
- Expected Result: $http.post header Authorization equals 'Bearer '.

- Test Name: AuditService - logAlertCreation (success)
- Purpose: Verify that logAlertCreation posts a correctly structured audit record and returns response data.
- Scenario: Valid alertId and transactionId provided; $http.post succeeds.
- Expected Result: Promise resolves with response.data.

- Test Name: AuditService - logAlertCreation (HTTP failure)
- Purpose: Verify that logAlertCreation returns null on HTTP error.
- Scenario: $http.post rejects.
- Expected Result: Resolved value is null.

- Test Name: AuditService - logAlertCreation (correct audit record fields)
- Purpose: Verify that logAlertCreation constructs the audit record with all required fields.
- Scenario: alertId is 'ALT-001', transactionId is 'TXN-001'.
- Expected Result: Posted body contains alert_id, transaction_id, event_type='fraud_alert_created', and a valid timestamp.

- Test Name: AuditService - logAlertCreation (correct API endpoint)
- Purpose: Verify that both logDecision and logAlertCreation post to /api/audit/log.
- Scenario: Both methods are called.
- Expected Result: $http.post is called with '/api/audit/log' in both cases.

- Test Name: AuditService - logAlertCreation (uses Authorization header)
- Purpose: Verify that logAlertCreation attaches the Bearer token from localStorage.
- Scenario: localStorage contains authToken 'audit-token-002'.
- Expected Result: $http.post header Authorization equals 'Bearer audit-token-002'.

Coverage Report:
- Functions tested: logDecision, logAlertCreation, getAuthToken (indirectly)
- Scenarios covered: success, HTTP failure, audit record field validation, auth token present, auth token absent, API endpoint correctness, event_type correctness, ISO timestamp validation
- Uncovered scenarios: concurrent audit log calls, network timeout specifics
*/

(function () {
  'use strict';

  describe('AuditService', function () {
    var AuditService;
    var $http;
    var $q;
    var $rootScope;
    var deferred;

    beforeEach(module('fraudAlertModule'));

    beforeEach(inject(function (_AuditService_, _$http_, _$q_, _$rootScope_) {
      AuditService = _AuditService_;
      $http = _$http_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
      spyOn(localStorage, 'getItem').and.returnValue('default-audit-token');
    });

    // ─── logDecision ───────────────────────────────────────────────────────────

    describe('logDecision', function () {
      var mockTransaction;

      beforeEach(function () {
        mockTransaction = {
          transaction_id: 'TXN-100',
          account_id: 'ACC-200'
        };
      });

      it('should resolve with response data when $http.post succeeds', function () {
        var resolved;
        var mockResponseData = { log_id: 'LOG-001', status: 'recorded' };
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'approve', 72).then(function (data) {
          resolved = data;
        });

        deferred.resolve({ data: mockResponseData });
        $rootScope.$digest();

        expect(resolved).toEqual(mockResponseData);
      });

      it('should return null when $http.post fails', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'decline', 95).then(function (data) {
          resolved = data;
        });

        deferred.reject({ status: 500 });
        $rootScope.$digest();

        expect(resolved).toBeNull();
      });

      it('should post to /api/audit/log endpoint', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'alert', 80);
        $rootScope.$digest();

        expect($http.post.calls.mostRecent().args[0]).toBe('/api/audit/log');
      });

      it('should post audit record with all required fields', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'approve', 72);
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(postedBody.transaction_id).toBe('TXN-100');
        expect(postedBody.account_id).toBe('ACC-200');
        expect(postedBody.decision).toBe('approve');
        expect(postedBody.risk_score).toBe(72);
        expect(postedBody.event_type).toBe('fraud_decision');
      });

      it('should include a valid ISO timestamp in the audit record', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'approve', 72);
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(new Date(postedBody.timestamp).toString()).not.toBe('Invalid Date');
      });

      it('should attach Authorization header with token from localStorage', function () {
        localStorage.getItem.and.returnValue('audit-token-001');
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'approve', 72);
        $rootScope.$digest();

        var callArgs = $http.post.calls.mostRecent().args;
        expect(callArgs[2]).toEqual({ headers: { Authorization: 'Bearer audit-token-001' } });
      });

      it('should use empty string for Authorization when localStorage returns null', function () {
        localStorage.getItem.and.returnValue(null);
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'approve', 72);
        $rootScope.$digest();

        var callArgs = $http.post.calls.mostRecent().args;
        expect(callArgs[2]).toEqual({ headers: { Authorization: 'Bearer ' } });
      });

      it('should handle all valid fraud decision types', function () {
        var decisions = ['approve', 'alert', 'decline', 'hold', 'step-up'];
        decisions.forEach(function (decision) {
          deferred = $q.defer();
          spyOn($http, 'post').and.returnValue(deferred.promise);
          AuditService.logDecision(mockTransaction, decision, 70);
          $rootScope.$digest();
          var postedBody = $http.post.calls.mostRecent().args[1];
          expect(postedBody.decision).toBe(decision);
          $http.post.calls.reset();
        });
      });

      it('should log decision with risk score of 0 (boundary low)', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'approve', 0);
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(postedBody.risk_score).toBe(0);
      });

      it('should log decision with risk score of 100 (boundary high)', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logDecision(mockTransaction, 'decline', 100);
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(postedBody.risk_score).toBe(100);
      });
    });

    // ─── logAlertCreation ──────────────────────────────────────────────────────

    describe('logAlertCreation', function () {

      it('should resolve with response data when $http.post succeeds', function () {
        var resolved;
        var mockResponseData = { log_id: 'LOG-002', status: 'recorded' };
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001').then(function (data) {
          resolved = data;
        });

        deferred.resolve({ data: mockResponseData });
        $rootScope.$digest();

        expect(resolved).toEqual(mockResponseData);
      });

      it('should return null when $http.post fails', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001').then(function (data) {
          resolved = data;
        });

        deferred.reject({ status: 503 });
        $rootScope.$digest();

        expect(resolved).toBeNull();
      });

      it('should post to /api/audit/log endpoint', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001');
        $rootScope.$digest();

        expect($http.post.calls.mostRecent().args[0]).toBe('/api/audit/log');
      });

      it('should post audit record with all required fields', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001');
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(postedBody.alert_id).toBe('ALT-001');
        expect(postedBody.transaction_id).toBe('TXN-001');
        expect(postedBody.event_type).toBe('fraud_alert_created');
      });

      it('should include a valid ISO timestamp in the audit record', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001');
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(new Date(postedBody.timestamp).toString()).not.toBe('Invalid Date');
      });

      it('should attach Authorization header with token from localStorage', function () {
        localStorage.getItem.and.returnValue('audit-token-002');
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001');
        $rootScope.$digest();

        var callArgs = $http.post.calls.mostRecent().args;
        expect(callArgs[2]).toEqual({ headers: { Authorization: 'Bearer audit-token-002' } });
      });

      it('should use empty string for Authorization when localStorage returns null', function () {
        localStorage.getItem.and.returnValue(null);
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AuditService.logAlertCreation('ALT-001', 'TXN-001');
        $rootScope.$digest();

        var callArgs = $http.post.calls.mostRecent().args;
        expect(callArgs[2]).toEqual({ headers: { Authorization: 'Bearer ' } });
      });

      it('should handle ALERT-prefixed IDs generated by AlertRecordService', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        var generatedAlertId = 'ALERT-' + Date.now() + '-abc123xyz';
        AuditService.logAlertCreation(generatedAlertId, 'TXN-001');
        $rootScope.$digest();

        var postedBody = $http.post.calls.mostRecent().args[1];
        expect(postedBody.alert_id).toBe(generatedAlertId);
      });
    });
  });
}());
