/*
Test Documentation:
- Test Name: AlertRecordService - createAlert (success)
- Purpose: Verify that createAlert posts correct alert data and resolves with alert_id and status.
- Scenario: Valid transaction, riskScore, and riskBand are provided; $http.post succeeds.
- Expected Result: Promise resolves with { alert_id: 'ALT001', status: 'open' }

- Test Name: AlertRecordService - createAlert (server returns no alert_id)
- Purpose: Verify that createAlert falls back to a generated alert_id when server omits it.
- Scenario: $http.post resolves with response.data missing alert_id.
- Expected Result: Promise resolves with an alert_id matching /^ALERT-/ and status 'open'.

- Test Name: AlertRecordService - createAlert (HTTP failure)
- Purpose: Verify that createAlert rejects the promise on HTTP error.
- Scenario: $http.post rejects with a network error object.
- Expected Result: Promise rejects with the error object.

- Test Name: AlertRecordService - createAlert (uses Authorization header)
- Purpose: Verify that createAlert attaches the Bearer token from localStorage.
- Scenario: localStorage contains authToken 'test-token-123'.
- Expected Result: $http.post is called with header Authorization: 'Bearer test-token-123'.

- Test Name: AlertRecordService - createAlert (empty authToken fallback)
- Purpose: Verify that createAlert uses empty string when localStorage has no authToken.
- Scenario: localStorage.getItem returns null.
- Expected Result: $http.post header Authorization equals 'Bearer '.

- Test Name: AlertRecordService - getAlerts (success)
- Purpose: Verify that getAlerts returns the array of alerts from the API.
- Scenario: $http.get resolves with response.data as an array.
- Expected Result: Resolved value equals the array returned by the API.

- Test Name: AlertRecordService - getAlerts (HTTP failure)
- Purpose: Verify that getAlerts returns an empty array on HTTP error.
- Scenario: $http.get rejects.
- Expected Result: Resolved value is [].

- Test Name: AlertRecordService - updateAlertStatus (success)
- Purpose: Verify that updateAlertStatus patches the correct endpoint and returns response data.
- Scenario: $http.patch resolves with updated alert data.
- Expected Result: Resolved value equals response.data.

- Test Name: AlertRecordService - updateAlertStatus (HTTP failure)
- Purpose: Verify that updateAlertStatus returns null on HTTP error.
- Scenario: $http.patch rejects.
- Expected Result: Resolved value is null.

- Test Name: AlertRecordService - updateAlertStatus (correct URL construction)
- Purpose: Verify that updateAlertStatus calls the correct URL with alertId.
- Scenario: alertId is 'ALT-999'.
- Expected Result: $http.patch is called with '/api/alerts/ALT-999'.

Coverage Report:
- Functions tested: createAlert, getAlerts, updateAlertStatus, generateAlertId (indirectly), getAuthToken (indirectly)
- Scenarios covered: success, HTTP failure, missing alert_id fallback, auth token present, auth token absent, URL construction
- Uncovered scenarios: concurrent requests, network timeout specifics
*/

(function () {
  'use strict';

  describe('AlertRecordService', function () {
    var AlertRecordService;
    var $http;
    var $q;
    var $rootScope;
    var deferred;

    beforeEach(module('fraudAlertModule'));

    beforeEach(inject(function (_AlertRecordService_, _$http_, _$q_, _$rootScope_) {
      AlertRecordService = _AlertRecordService_;
      $http = _$http_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
      spyOn(localStorage, 'getItem').and.returnValue('test-token-abc');
    });

    // ─── createAlert ───────────────────────────────────────────────────────────

    describe('createAlert', function () {
      var mockTransaction;

      beforeEach(function () {
        mockTransaction = {
          transaction_id: 'TXN-001',
          account_id: 'ACC-001',
          card_id: 'CARD-001'
        };
      });

      it('should resolve with alert_id and status when $http.post succeeds', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 85, 'HIGH').then(function (result) {
          resolved = result;
        });

        deferred.resolve({ data: { alert_id: 'ALT001', status: 'open' } });
        $rootScope.$digest();

        expect(resolved).toEqual({ alert_id: 'ALT001', status: 'open' });
      });

      it('should generate a fallback alert_id when server response omits alert_id', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 60, 'MEDIUM').then(function (result) {
          resolved = result;
        });

        deferred.resolve({ data: { status: 'open' } });
        $rootScope.$digest();

        expect(resolved.alert_id).toMatch(/^ALERT-/);
        expect(resolved.status).toBe('open');
      });

      it('should use default status open when server response omits status', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 60, 'MEDIUM').then(function (result) {
          resolved = result;
        });

        deferred.resolve({ data: { alert_id: 'ALT002' } });
        $rootScope.$digest();

        expect(resolved.status).toBe('open');
      });

      it('should reject the promise when $http.post fails', function () {
        var rejected;
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 90, 'HIGH').then(null, function (err) {
          rejected = err;
        });

        deferred.reject({ status: 500, statusText: 'Internal Server Error' });
        $rootScope.$digest();

        expect(rejected).toEqual({ status: 500, statusText: 'Internal Server Error' });
      });

      it('should call $http.post with the Authorization header from localStorage', function () {
        localStorage.getItem.and.returnValue('test-token-123');
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 75, 'HIGH');
        $rootScope.$digest();

        expect($http.post).toHaveBeenCalledWith(
          '/api/alerts',
          jasmine.any(Object),
          { headers: { Authorization: 'Bearer test-token-123' } }
        );
      });

      it('should use empty string for Authorization when localStorage returns null', function () {
        localStorage.getItem.and.returnValue(null);
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 75, 'HIGH');
        $rootScope.$digest();

        expect($http.post).toHaveBeenCalledWith(
          '/api/alerts',
          jasmine.any(Object),
          { headers: { Authorization: 'Bearer ' } }
        );
      });

      it('should post alertData containing correct transaction fields', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 80, 'HIGH');
        $rootScope.$digest();

        var postedData = $http.post.calls.mostRecent().args[1];
        expect(postedData.transaction_id).toBe('TXN-001');
        expect(postedData.account_id).toBe('ACC-001');
        expect(postedData.card_id).toBe('CARD-001');
        expect(postedData.risk_score).toBe(80);
        expect(postedData.risk_band).toBe('HIGH');
        expect(postedData.action).toBe('alert');
        expect(postedData.status).toBe('open');
      });

      it('should include a valid ISO timestamp in alertData', function () {
        deferred = $q.defer();
        spyOn($http, 'post').and.returnValue(deferred.promise);

        AlertRecordService.createAlert(mockTransaction, 80, 'HIGH');
        $rootScope.$digest();

        var postedData = $http.post.calls.mostRecent().args[1];
        expect(new Date(postedData.created_at).toString()).not.toBe('Invalid Date');
      });
    });

    // ─── getAlerts ─────────────────────────────────────────────────────────────

    describe('getAlerts', function () {

      it('should return alert array when $http.get succeeds', function () {
        var resolved;
        var mockAlerts = [{ alert_id: 'ALT001' }, { alert_id: 'ALT002' }];
        deferred = $q.defer();
        spyOn($http, 'get').and.returnValue(deferred.promise);

        AlertRecordService.getAlerts().then(function (data) {
          resolved = data;
        });

        deferred.resolve({ data: mockAlerts });
        $rootScope.$digest();

        expect(resolved).toEqual(mockAlerts);
      });

      it('should return empty array when $http.get fails', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'get').and.returnValue(deferred.promise);

        AlertRecordService.getAlerts().then(function (data) {
          resolved = data;
        });

        deferred.reject({ status: 503 });
        $rootScope.$digest();

        expect(resolved).toEqual([]);
      });

      it('should call $http.get with the correct API URL', function () {
        deferred = $q.defer();
        spyOn($http, 'get').and.returnValue(deferred.promise);

        AlertRecordService.getAlerts();
        $rootScope.$digest();

        expect($http.get).toHaveBeenCalledWith(
          '/api/alerts',
          jasmine.objectContaining({ headers: jasmine.any(Object) })
        );
      });

      it('should attach Authorization header when calling getAlerts', function () {
        localStorage.getItem.and.returnValue('secure-token-xyz');
        deferred = $q.defer();
        spyOn($http, 'get').and.returnValue(deferred.promise);

        AlertRecordService.getAlerts();
        $rootScope.$digest();

        expect($http.get).toHaveBeenCalledWith(
          '/api/alerts',
          { headers: { Authorization: 'Bearer secure-token-xyz' } }
        );
      });
    });

    // ─── updateAlertStatus ─────────────────────────────────────────────────────

    describe('updateAlertStatus', function () {

      it('should return response data when $http.patch succeeds', function () {
        var resolved;
        var mockResponse = { alert_id: 'ALT001', status: 'resolved' };
        deferred = $q.defer();
        spyOn($http, 'patch').and.returnValue(deferred.promise);

        AlertRecordService.updateAlertStatus('ALT001', 'resolved').then(function (data) {
          resolved = data;
        });

        deferred.resolve({ data: mockResponse });
        $rootScope.$digest();

        expect(resolved).toEqual(mockResponse);
      });

      it('should return null when $http.patch fails', function () {
        var resolved;
        deferred = $q.defer();
        spyOn($http, 'patch').and.returnValue(deferred.promise);

        AlertRecordService.updateAlertStatus('ALT001', 'resolved').then(function (data) {
          resolved = data;
        });

        deferred.reject({ status: 404 });
        $rootScope.$digest();

        expect(resolved).toBeNull();
      });

      it('should call $http.patch with the correct URL including alertId', function () {
        deferred = $q.defer();
        spyOn($http, 'patch').and.returnValue(deferred.promise);

        AlertRecordService.updateAlertStatus('ALT-999', 'confirmed');
        $rootScope.$digest();

        expect($http.patch).toHaveBeenCalledWith(
          '/api/alerts/ALT-999',
          { status: 'confirmed' },
          jasmine.any(Object)
        );
      });

      it('should attach Authorization header when calling updateAlertStatus', function () {
        localStorage.getItem.and.returnValue('patch-token-456');
        deferred = $q.defer();
        spyOn($http, 'patch').and.returnValue(deferred.promise);

        AlertRecordService.updateAlertStatus('ALT-001', 'open');
        $rootScope.$digest();

        var callArgs = $http.patch.calls.mostRecent().args;
        expect(callArgs[2]).toEqual({ headers: { Authorization: 'Bearer patch-token-456' } });
      });

      it('should handle all valid alert status transitions', function () {
        var statuses = ['open', 'confirmed', 'reported', 'resolved', 'expired', 'protected'];
        statuses.forEach(function (status) {
          deferred = $q.defer();
          spyOn($http, 'patch').and.returnValue(deferred.promise);
          AlertRecordService.updateAlertStatus('ALT-001', status);
          $rootScope.$digest();
          expect($http.patch).toHaveBeenCalledWith(
            '/api/alerts/ALT-001',
            { status: status },
            jasmine.any(Object)
          );
          $http.patch.calls.reset();
        });
      });
    });
  });
}());
