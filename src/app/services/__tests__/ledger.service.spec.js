/*
Test Documentation:

- Test Name: LedgerService - postHold
  Purpose: Validate that a HOLD ledger entry is posted correctly via HTTP POST.
  Scenario: Normal - valid payerId, amount, currency provided.
  Expected Result: Resolves with response.data from $http.post.

- Test Name: LedgerService - postHold (error)
  Purpose: Validate error handling when $http.post fails for HOLD.
  Scenario: Error - $http.post rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - postHold payload structure
  Purpose: Validate the payload sent to the ledger API for a HOLD entry.
  Scenario: Normal - inspect payload fields.
  Expected Result: Payload contains type=HOLD, debitAccount=payerId, creditAccount=SUSPENSE, immutable=true, and a valid ISO timestamp.

- Test Name: LedgerService - postCapture
  Purpose: Validate that a CAPTURE ledger entry is posted correctly.
  Scenario: Normal - valid paymentId, amount, currency, payeeId provided.
  Expected Result: Resolves with response.data.

- Test Name: LedgerService - postCapture (error)
  Purpose: Validate error handling when $http.post fails for CAPTURE.
  Scenario: Error - $http.post rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - postCapture payload structure
  Purpose: Validate the payload sent for a CAPTURE entry.
  Scenario: Normal - inspect payload fields.
  Expected Result: Payload contains type=CAPTURE, debitAccount=SUSPENSE, creditAccount=payeeId, immutable=true.

- Test Name: LedgerService - postVoid
  Purpose: Validate that a VOID ledger entry is posted correctly.
  Scenario: Normal - valid paymentId, amount, currency, payerId provided.
  Expected Result: Resolves with response.data.

- Test Name: LedgerService - postVoid (error)
  Purpose: Validate error handling when $http.post fails for VOID.
  Scenario: Error - $http.post rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - postVoid payload structure
  Purpose: Validate the payload sent for a VOID entry.
  Scenario: Normal - inspect payload fields.
  Expected Result: Payload contains type=VOID, debitAccount=SUSPENSE, creditAccount=payerId, immutable=true.

- Test Name: LedgerService - postRefund
  Purpose: Validate that a REFUND ledger entry is posted correctly.
  Scenario: Normal - valid paymentId, amount, currency, payerId, payeeId provided.
  Expected Result: Resolves with response.data.

- Test Name: LedgerService - postRefund (error)
  Purpose: Validate error handling when $http.post fails for REFUND.
  Scenario: Error - $http.post rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - postRefund payload structure
  Purpose: Validate the payload sent for a REFUND entry.
  Scenario: Normal - inspect payload fields.
  Expected Result: Payload contains type=REFUND, debitAccount=payeeId, creditAccount=payerId, immutable=true.

- Test Name: LedgerService - postPayoutEntry
  Purpose: Validate that a PAYOUT ledger entry is posted correctly.
  Scenario: Normal - valid payoutId, amount, currency, merchantId provided.
  Expected Result: Resolves with response.data.

- Test Name: LedgerService - postPayoutEntry (error)
  Purpose: Validate error handling when $http.post fails for PAYOUT.
  Scenario: Error - $http.post rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - postPayoutEntry payload structure
  Purpose: Validate the payload sent for a PAYOUT entry.
  Scenario: Normal - inspect payload fields.
  Expected Result: Payload contains type=PAYOUT, debitAccount=PLATFORM, creditAccount=merchantId, immutable=true.

- Test Name: LedgerService - openAccounts
  Purpose: Validate that a merchant ledger account is opened correctly.
  Scenario: Normal - valid merchantId provided.
  Expected Result: Resolves with response.data.

- Test Name: LedgerService - openAccounts (error)
  Purpose: Validate error handling when $http.post fails for openAccounts.
  Scenario: Error - $http.post rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - openAccounts payload structure
  Purpose: Validate the payload sent for opening a merchant account.
  Scenario: Normal - inspect payload fields.
  Expected Result: Payload contains merchantId, accountType=MERCHANT_SETTLEMENT, currency=GBP, status=ACTIVE.

- Test Name: LedgerService - clearMatchedEntries
  Purpose: Validate that a matched reconciliation entry is cleared via HTTP PUT.
  Scenario: Normal - valid matchId provided.
  Expected Result: Resolves with response.data.

- Test Name: LedgerService - clearMatchedEntries (error)
  Purpose: Validate error handling when $http.put fails for clearMatchedEntries.
  Scenario: Error - $http.put rejects.
  Expected Result: Promise is rejected with the error object.

- Test Name: LedgerService - clearMatchedEntries URL construction
  Purpose: Validate that the correct URL is constructed using matchId.
  Scenario: Normal - inspect URL used in $http.put.
  Expected Result: URL ends with /ledger/reconciliation/<matchId>/clear.

- Test Name: LedgerService - immutable flag on all entries
  Purpose: Validate financial integrity — all ledger entries are immutable per FR-LED-02 and NFR-FIN-03.
  Scenario: Boundary - all posting methods must set immutable=true.
  Expected Result: Every posting payload has immutable set to true.

- Test Name: LedgerService - timestamp ISO format on all entries
  Purpose: Validate that all ledger postings include a valid ISO 8601 timestamp.
  Scenario: Normal - timestamp field present and valid.
  Expected Result: timestamp is a valid ISO 8601 date string.

- Test Name: LedgerService - postHold uses correct API base URL
  Purpose: Validate that API_CONFIG.baseUrl is used for all HTTP calls.
  Scenario: Normal - baseUrl is prepended correctly.
  Expected Result: $http.post is called with URL starting with API_CONFIG.baseUrl.

Coverage Report:
- Functions tested: postHold, postCapture, postVoid, postRefund, postPayoutEntry, openAccounts, clearMatchedEntries
- Scenarios covered: success resolution, error rejection, payload structure validation, URL construction, immutability flag, ISO timestamp, API base URL usage
- Uncovered scenarios: concurrent retry idempotency (integration-level), ledger balance assertion across entries (integration-level), network timeout (infrastructure-level)
*/

describe('LedgerService', function() {

  var LedgerService;
  var $http;
  var $q;
  var $rootScope;
  var API_CONFIG;
  var deferred;

  beforeEach(module('mpspApp'));

  beforeEach(module(function($provide) {
    API_CONFIG = { baseUrl: 'https://api.mpsp.test' };
    $provide.constant('API_CONFIG', API_CONFIG);
  }));

  beforeEach(inject(function(_LedgerService_, _$http_, _$q_, _$rootScope_) {
    LedgerService = _LedgerService_;
    $http = _$http_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  // ─────────────────────────────────────────────
  // postHold
  // ─────────────────────────────────────────────
  describe('postHold', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { entryId: 'hold-001', type: 'HOLD' } };
      spyOn($http, 'post').and.returnValue($q.resolve(mockResponse));

      LedgerService.postHold('payer-123', 100.00, 'GBP').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 500, data: 'Internal Server Error' };
      spyOn($http, 'post').and.returnValue($q.reject(mockError));

      LedgerService.postHold('payer-123', 100.00, 'GBP').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should post to the correct ledger entries URL', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));

      LedgerService.postHold('payer-123', 100.00, 'GBP');
      $rootScope.$digest();

      expect($http.post).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/entries',
        jasmine.any(Object)
      );
    });

    it('should send a payload with type HOLD and correct accounts', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postHold('payer-456', 250.00, 'USD');
      $rootScope.$digest();

      expect(capturedPayload.type).toBe('HOLD');
      expect(capturedPayload.debitAccount).toBe('payer-456');
      expect(capturedPayload.creditAccount).toBe('SUSPENSE');
      expect(capturedPayload.amount).toBe(250.00);
      expect(capturedPayload.currency).toBe('USD');
    });

    it('should set immutable to true in the HOLD payload (FR-LED-02 / NFR-FIN-03)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postHold('payer-789', 50.00, 'EUR');
      $rootScope.$digest();

      expect(capturedPayload.immutable).toBe(true);
    });

    it('should include a valid ISO 8601 timestamp in the HOLD payload', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postHold('payer-123', 100.00, 'GBP');
      $rootScope.$digest();

      expect(capturedPayload.timestamp).toBeDefined();
      expect(new Date(capturedPayload.timestamp).toISOString()).toBe(capturedPayload.timestamp);
    });

    it('should return a promise', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));
      var result = LedgerService.postHold('payer-123', 100.00, 'GBP');
      expect(typeof result.then).toBe('function');
    });

  });

  // ─────────────────────────────────────────────
  // postCapture
  // ─────────────────────────────────────────────
  describe('postCapture', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { entryId: 'cap-001', type: 'CAPTURE' } };
      spyOn($http, 'post').and.returnValue($q.resolve(mockResponse));

      LedgerService.postCapture('pay-001', 200.00, 'GBP', 'payee-001').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 503, data: 'Service Unavailable' };
      spyOn($http, 'post').and.returnValue($q.reject(mockError));

      LedgerService.postCapture('pay-001', 200.00, 'GBP', 'payee-001').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should send a payload with type CAPTURE and correct accounts', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postCapture('pay-001', 200.00, 'GBP', 'payee-001');
      $rootScope.$digest();

      expect(capturedPayload.type).toBe('CAPTURE');
      expect(capturedPayload.paymentId).toBe('pay-001');
      expect(capturedPayload.debitAccount).toBe('SUSPENSE');
      expect(capturedPayload.creditAccount).toBe('payee-001');
      expect(capturedPayload.amount).toBe(200.00);
      expect(capturedPayload.currency).toBe('GBP');
    });

    it('should set immutable to true in the CAPTURE payload (FR-LED-02 / NFR-FIN-03)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postCapture('pay-001', 200.00, 'GBP', 'payee-001');
      $rootScope.$digest();

      expect(capturedPayload.immutable).toBe(true);
    });

    it('should include a valid ISO 8601 timestamp in the CAPTURE payload', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postCapture('pay-001', 200.00, 'GBP', 'payee-001');
      $rootScope.$digest();

      expect(capturedPayload.timestamp).toBeDefined();
      expect(new Date(capturedPayload.timestamp).toISOString()).toBe(capturedPayload.timestamp);
    });

    it('should post to the correct ledger entries URL', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));

      LedgerService.postCapture('pay-001', 200.00, 'GBP', 'payee-001');
      $rootScope.$digest();

      expect($http.post).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/entries',
        jasmine.any(Object)
      );
    });

  });

  // ─────────────────────────────────────────────
  // postVoid
  // ─────────────────────────────────────────────
  describe('postVoid', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { entryId: 'void-001', type: 'VOID' } };
      spyOn($http, 'post').and.returnValue($q.resolve(mockResponse));

      LedgerService.postVoid('pay-002', 150.00, 'GBP', 'payer-002').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 400, data: 'Bad Request' };
      spyOn($http, 'post').and.returnValue($q.reject(mockError));

      LedgerService.postVoid('pay-002', 150.00, 'GBP', 'payer-002').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should send a payload with type VOID and correct accounts', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postVoid('pay-002', 150.00, 'GBP', 'payer-002');
      $rootScope.$digest();

      expect(capturedPayload.type).toBe('VOID');
      expect(capturedPayload.paymentId).toBe('pay-002');
      expect(capturedPayload.debitAccount).toBe('SUSPENSE');
      expect(capturedPayload.creditAccount).toBe('payer-002');
      expect(capturedPayload.amount).toBe(150.00);
      expect(capturedPayload.currency).toBe('GBP');
    });

    it('should set immutable to true in the VOID payload (FR-LED-02 / NFR-FIN-03)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postVoid('pay-002', 150.00, 'GBP', 'payer-002');
      $rootScope.$digest();

      expect(capturedPayload.immutable).toBe(true);
    });

    it('should include a valid ISO 8601 timestamp in the VOID payload', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postVoid('pay-002', 150.00, 'GBP', 'payer-002');
      $rootScope.$digest();

      expect(capturedPayload.timestamp).toBeDefined();
      expect(new Date(capturedPayload.timestamp).toISOString()).toBe(capturedPayload.timestamp);
    });

    it('should post to the correct ledger entries URL', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));

      LedgerService.postVoid('pay-002', 150.00, 'GBP', 'payer-002');
      $rootScope.$digest();

      expect($http.post).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/entries',
        jasmine.any(Object)
      );
    });

  });

  // ─────────────────────────────────────────────
  // postRefund
  // ─────────────────────────────────────────────
  describe('postRefund', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { entryId: 'ref-001', type: 'REFUND' } };
      spyOn($http, 'post').and.returnValue($q.resolve(mockResponse));

      LedgerService.postRefund('pay-003', 75.00, 'GBP', 'payer-003', 'payee-003').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 422, data: 'Unprocessable Entity' };
      spyOn($http, 'post').and.returnValue($q.reject(mockError));

      LedgerService.postRefund('pay-003', 75.00, 'GBP', 'payer-003', 'payee-003').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should send a payload with type REFUND and reversed accounts (compensating entry per FR-PAY-07)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postRefund('pay-003', 75.00, 'GBP', 'payer-003', 'payee-003');
      $rootScope.$digest();

      expect(capturedPayload.type).toBe('REFUND');
      expect(capturedPayload.paymentId).toBe('pay-003');
      expect(capturedPayload.debitAccount).toBe('payee-003');
      expect(capturedPayload.creditAccount).toBe('payer-003');
      expect(capturedPayload.amount).toBe(75.00);
      expect(capturedPayload.currency).toBe('GBP');
    });

    it('should set immutable to true in the REFUND payload (FR-LED-02 / NFR-FIN-03)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postRefund('pay-003', 75.00, 'GBP', 'payer-003', 'payee-003');
      $rootScope.$digest();

      expect(capturedPayload.immutable).toBe(true);
    });

    it('should include a valid ISO 8601 timestamp in the REFUND payload', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postRefund('pay-003', 75.00, 'GBP', 'payer-003', 'payee-003');
      $rootScope.$digest();

      expect(capturedPayload.timestamp).toBeDefined();
      expect(new Date(capturedPayload.timestamp).toISOString()).toBe(capturedPayload.timestamp);
    });

    it('should post to the correct ledger entries URL', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));

      LedgerService.postRefund('pay-003', 75.00, 'GBP', 'payer-003', 'payee-003');
      $rootScope.$digest();

      expect($http.post).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/entries',
        jasmine.any(Object)
      );
    });

  });

  // ─────────────────────────────────────────────
  // postPayoutEntry
  // ─────────────────────────────────────────────
  describe('postPayoutEntry', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { entryId: 'payout-001', type: 'PAYOUT' } };
      spyOn($http, 'post').and.returnValue($q.resolve(mockResponse));

      LedgerService.postPayoutEntry('pout-001', 500.00, 'GBP', 'merch-001').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 502, data: 'Bad Gateway' };
      spyOn($http, 'post').and.returnValue($q.reject(mockError));

      LedgerService.postPayoutEntry('pout-001', 500.00, 'GBP', 'merch-001').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should send a payload with type PAYOUT and correct accounts (FR-SET-04)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postPayoutEntry('pout-001', 500.00, 'GBP', 'merch-001');
      $rootScope.$digest();

      expect(capturedPayload.type).toBe('PAYOUT');
      expect(capturedPayload.payoutId).toBe('pout-001');
      expect(capturedPayload.debitAccount).toBe('PLATFORM');
      expect(capturedPayload.creditAccount).toBe('merch-001');
      expect(capturedPayload.amount).toBe(500.00);
      expect(capturedPayload.currency).toBe('GBP');
    });

    it('should set immutable to true in the PAYOUT payload (FR-LED-02 / NFR-FIN-03)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postPayoutEntry('pout-001', 500.00, 'GBP', 'merch-001');
      $rootScope.$digest();

      expect(capturedPayload.immutable).toBe(true);
    });

    it('should include a valid ISO 8601 timestamp in the PAYOUT payload', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.postPayoutEntry('pout-001', 500.00, 'GBP', 'merch-001');
      $rootScope.$digest();

      expect(capturedPayload.timestamp).toBeDefined();
      expect(new Date(capturedPayload.timestamp).toISOString()).toBe(capturedPayload.timestamp);
    });

    it('should post to the correct ledger entries URL', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));

      LedgerService.postPayoutEntry('pout-001', 500.00, 'GBP', 'merch-001');
      $rootScope.$digest();

      expect($http.post).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/entries',
        jasmine.any(Object)
      );
    });

  });

  // ─────────────────────────────────────────────
  // openAccounts
  // ─────────────────────────────────────────────
  describe('openAccounts', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { accountId: 'acc-001', status: 'ACTIVE' } };
      spyOn($http, 'post').and.returnValue($q.resolve(mockResponse));

      LedgerService.openAccounts('merch-001').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 409, data: 'Conflict' };
      spyOn($http, 'post').and.returnValue($q.reject(mockError));

      LedgerService.openAccounts('merch-001').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should send a payload with correct account opening structure (FR-SET-01)', function() {
      var capturedPayload;
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayload = payload;
        return $q.resolve({ data: {} });
      });

      LedgerService.openAccounts('merch-001');
      $rootScope.$digest();

      expect(capturedPayload.merchantId).toBe('merch-001');
      expect(capturedPayload.accountType).toBe('MERCHANT_SETTLEMENT');
      expect(capturedPayload.currency).toBe('GBP');
      expect(capturedPayload.status).toBe('ACTIVE');
    });

    it('should post to the correct ledger accounts URL', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));

      LedgerService.openAccounts('merch-001');
      $rootScope.$digest();

      expect($http.post).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/accounts',
        jasmine.any(Object)
      );
    });

  });

  // ─────────────────────────────────────────────
  // clearMatchedEntries
  // ─────────────────────────────────────────────
  describe('clearMatchedEntries', function() {

    it('should resolve with response data on success', function() {
      var resolved;
      var mockResponse = { data: { matchId: 'match-001', status: 'CLEARED' } };
      spyOn($http, 'put').and.returnValue($q.resolve(mockResponse));

      LedgerService.clearMatchedEntries('match-001').then(function(data) {
        resolved = data;
      });
      $rootScope.$digest();

      expect(resolved).toEqual(mockResponse.data);
    });

    it('should reject with error on $http failure', function() {
      var rejected;
      var mockError = { status: 404, data: 'Not Found' };
      spyOn($http, 'put').and.returnValue($q.reject(mockError));

      LedgerService.clearMatchedEntries('match-001').then(null, function(err) {
        rejected = err;
      });
      $rootScope.$digest();

      expect(rejected).toEqual(mockError);
    });

    it('should construct the correct URL with matchId for clearing reconciliation (FR-REC-03)', function() {
      spyOn($http, 'put').and.returnValue($q.resolve({ data: {} }));

      LedgerService.clearMatchedEntries('match-123');
      $rootScope.$digest();

      expect($http.put).toHaveBeenCalledWith(
        API_CONFIG.baseUrl + '/ledger/reconciliation/match-123/clear'
      );
    });

    it('should use HTTP PUT method for clearing matched entries', function() {
      spyOn($http, 'put').and.returnValue($q.resolve({ data: {} }));

      LedgerService.clearMatchedEntries('match-001');
      $rootScope.$digest();

      expect($http.put).toHaveBeenCalled();
    });

  });

  // ─────────────────────────────────────────────
  // Cross-cutting concerns
  // ─────────────────────────────────────────────
  describe('Financial integrity and compliance', function() {

    it('should set immutable flag on all ledger entry types (FR-LED-02 / NFR-FIN-03)', function() {
      var capturedPayloads = [];
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayloads.push(payload);
        return $q.resolve({ data: {} });
      });

      LedgerService.postHold('payer-1', 100, 'GBP');
      LedgerService.postCapture('pay-1', 100, 'GBP', 'payee-1');
      LedgerService.postVoid('pay-2', 100, 'GBP', 'payer-2');
      LedgerService.postRefund('pay-3', 100, 'GBP', 'payer-3', 'payee-3');
      LedgerService.postPayoutEntry('pout-1', 100, 'GBP', 'merch-1');
      $rootScope.$digest();

      capturedPayloads.forEach(function(payload) {
        expect(payload.immutable).toBe(true);
      });
    });

    it('should include ISO 8601 timestamp on all ledger entry types', function() {
      var capturedPayloads = [];
      spyOn($http, 'post').and.callFake(function(url, payload) {
        capturedPayloads.push(payload);
        return $q.resolve({ data: {} });
      });

      LedgerService.postHold('payer-1', 100, 'GBP');
      LedgerService.postCapture('pay-1', 100, 'GBP', 'payee-1');
      LedgerService.postVoid('pay-2', 100, 'GBP', 'payer-2');
      LedgerService.postRefund('pay-3', 100, 'GBP', 'payer-3', 'payee-3');
      LedgerService.postPayoutEntry('pout-1', 100, 'GBP', 'merch-1');
      $rootScope.$digest();

      capturedPayloads.forEach(function(payload) {
        expect(payload.timestamp).toBeDefined();
        expect(new Date(payload.timestamp).toISOString()).toBe(payload.timestamp);
      });
    });

    it('should use API_CONFIG.baseUrl for all HTTP calls', function() {
      spyOn($http, 'post').and.returnValue($q.resolve({ data: {} }));
      spyOn($http, 'put').and.returnValue($q.resolve({ data: {} }));

      LedgerService.postHold('payer-1', 100, 'GBP');
      LedgerService.postCapture('pay-1', 100, 'GBP', 'payee-1');
      LedgerService.postVoid('pay-2', 100, 'GBP', 'payer-2');
      LedgerService.postRefund('pay-3', 100, 'GBP', 'payer-3', 'payee-3');
      LedgerService.postPayoutEntry('pout-1', 100, 'GBP', 'merch-1');
      LedgerService.openAccounts('merch-1');
      LedgerService.clearMatchedEntries('match-1');
      $rootScope.$digest();

      var allCalls = $http.post.calls.allArgs().concat($http.put.calls.allArgs());
      allCalls.forEach(function(callArgs) {
        var url = callArgs[0];
        expect(url.indexOf(API_CONFIG.baseUrl)).toBe(0);
      });
    });

  });

});