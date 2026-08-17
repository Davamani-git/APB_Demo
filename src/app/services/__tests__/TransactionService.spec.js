describe('TransactionService', function() {
  beforeEach(module('creditCardApp'));
  var TransactionService, $httpBackend, $q, API_ENDPOINT;
  var mockTransactions = [
    { id: 1, amount: 150.00, transactionDate: '2024-01-15T10:30:00Z', merchant: 'Store A' },
    { id: 2, amount: 75.50, transactionDate: '2024-01-14T14:20:00Z', merchant: 'Store B' },
    { id: 3, amount: 200.00, transactionDate: '2024-01-13T09:45:00Z', merchant: 'Store C' }
  ];

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _API_ENDPOINT_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_ENDPOINT = _API_ENDPOINT_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Success Scenario
  - Purpose: Validates successful retrieval and transformation of transactions
  - Scenario: API returns list of transactions with date strings
  - Expected Result: Returns array of transactions with Date objects
  */
  it('should fetch transactions and convert dates to Date objects', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, mockTransactions);
    var result;
    TransactionService.fetchTransactions().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result.length).toBe(3);
    expect(result[0].transactionDate instanceof Date).toBe(true);
    expect(result[1].transactionDate instanceof Date).toBe(true);
    expect(result[2].transactionDate instanceof Date).toBe(true);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Date Conversion Accuracy
  - Purpose: Validates correct conversion of ISO date strings to Date objects
  - Scenario: Verify specific transaction dates are correctly parsed
  - Expected Result: Date objects have correct timestamp values
  */
  it('should correctly parse ISO date strings to Date objects', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, mockTransactions);
    var result;
    TransactionService.fetchTransactions().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result[0].transactionDate.getTime()).toBe(new Date('2024-01-15T10:30:00Z').getTime());
    expect(result[1].transactionDate.getTime()).toBe(new Date('2024-01-14T14:20:00Z').getTime());
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Data Integrity
  - Purpose: Validates that non-date properties are preserved during transformation
  - Scenario: Check that transaction ID, amount, and merchant data remain unchanged
  - Expected Result: All transaction properties are preserved
  */
  it('should preserve all transaction properties during date conversion', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, mockTransactions);
    var result;
    TransactionService.fetchTransactions().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result[0].id).toBe(1);
    expect(result[0].amount).toBe(150.00);
    expect(result[0].merchant).toBe('Store A');
    expect(result[1].id).toBe(2);
    expect(result[1].amount).toBe(75.50);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Empty Response Scenario
  - Purpose: Validates handling of empty transaction list
  - Scenario: API returns empty array
  - Expected Result: Returns empty array
  */
  it('should handle empty transaction list', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, []);
    var result;
    TransactionService.fetchTransactions().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result).toEqual([]);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - HTTP Error Scenario
  - Purpose: Validates error handling when API call fails
  - Scenario: API returns 500 server error
  - Expected Result: Promise is rejected with error
  */
  it('should reject promise on HTTP 500 error', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(500, 'Server Error');
    var error;
    TransactionService.fetchTransactions().catch(function(err) {
      error = err;
    });
    $httpBackend.flush();
    expect(error).toBeDefined();
    expect(error.status).toBe(500);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - 404 Not Found Scenario
  - Purpose: Validates error handling when endpoint not found
  - Scenario: API returns 404 error
  - Expected Result: Promise is rejected with 404 error
  */
  it('should reject promise on HTTP 404 error', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(404, 'Not Found');
    var error;
    TransactionService.fetchTransactions().catch(function(err) {
      error = err;
    });
    $httpBackend.flush();
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Invalid Date Format Scenario
  - Purpose: Validates handling of invalid date strings
  - Scenario: Transaction contains invalid date format
  - Expected Result: Date object is created (may be Invalid Date)
  */
  it('should handle invalid date format gracefully', function() {
    var invalidTransactions = [
      { id: 1, amount: 100, transactionDate: 'invalid-date', merchant: 'Store' }
    ];
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, invalidTransactions);
    var result;
    TransactionService.fetchTransactions().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result[0].transactionDate instanceof Date).toBe(true);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Missing Date Property Scenario
  - Purpose: Validates handling of transactions without date property
  - Scenario: Transaction object missing transactionDate field
  - Expected Result: Creates Date object from undefined (Invalid Date)
  */
  it('should handle missing transactionDate property', function() {
    var transactionsNoDate = [
      { id: 1, amount: 100, merchant: 'Store' }
    ];
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(200, transactionsNoDate);
    var result;
    TransactionService.fetchTransactions().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result[0].transactionDate instanceof Date).toBe(true);
  });

  /*
  Test Documentation:
  - Test Name: fetchTransactions - Network Timeout Scenario
  - Purpose: Validates handling of network timeout
  - Scenario: HTTP request times out
  - Expected Result: Promise is rejected with timeout error
  */
  it('should reject promise on network timeout', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/transactions').respond(function() {
      return [0, null];
    });
    var error;
    TransactionService.fetchTransactions().catch(function(err) {
      error = err;
    });
    $httpBackend.flush();
    expect(error).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: TransactionService - Singleton Pattern
  - Purpose: Validates that TransactionService returns same instance
  - Scenario: Multiple injections of TransactionService
  - Expected Result: Same instance is returned each time
  */
  it('should return same instance on multiple injections', function() {
    var instance1 = TransactionService;
    var instance2;
    inject(function(_TransactionService_) {
      instance2 = _TransactionService_;
    });
    expect(instance1).toBe(instance2);
  });

  /*
  Coverage Report:
  - Functions tested: fetchTransactions
  - Scenarios covered:
    * Successful transaction retrieval with date conversion
    * Date string to Date object conversion accuracy
    * Preservation of non-date properties
    * Empty transaction list handling
    * HTTP 500 error handling
    * HTTP 404 error handling
    * Invalid date format handling
    * Missing transactionDate property handling
    * Network timeout handling
    * Service singleton pattern verification
  - Uncovered scenarios: 401/403 authentication errors, malformed JSON responses, very large datasets
  */
});
