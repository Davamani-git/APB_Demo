describe('TransactionService', function() {
  beforeEach(module('creditCardApp'));
  var TransactionService, $httpBackend, $q;

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions method', function() {
    /*
    Test Documentation:
    - Test Name: should successfully fetch transactions within date range
    - Purpose: Validates that getTransactions retrieves transaction data for specified date range
    - Scenario: API returns successful response with transaction list
    - Expected Result: Promise resolves with transaction data
    */
    it('should successfully fetch transactions within date range', function(done) {
      var dateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };
      var mockTransactions = [
        { id: 1, amount: 100, date: '2024-01-15' },
        { id: 2, amount: 200, date: '2024-01-20' }
      ];
      $httpBackend.expectGET('/api/transactions?startDate=2024-01-01&endDate=2024-01-31')
        .respond(200, mockTransactions);
      
      TransactionService.getTransactions(dateRange).then(function(data) {
        expect(data).toEqual(mockTransactions);
        expect(data.length).toBe(2);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should pass correct date parameters to API
    - Purpose: Validates that date range parameters are correctly formatted and passed
    - Scenario: getTransactions called with specific date range
    - Expected Result: HTTP request includes startDate and endDate parameters
    */
    it('should pass correct date parameters to API', function(done) {
      var dateRange = { startDate: '2023-12-01', endDate: '2023-12-31' };
      var mockTransactions = [];
      $httpBackend.expectGET('/api/transactions?startDate=2023-12-01&endDate=2023-12-31')
        .respond(200, mockTransactions);
      
      TransactionService.getTransactions(dateRange).then(function(data) {
        expect(data).toEqual(mockTransactions);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise when API returns error
    - Purpose: Validates error handling when transaction fetch fails
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise when API returns error', function(done) {
      var dateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };
      $httpBackend.expectGET('/api/transactions?startDate=2024-01-01&endDate=2024-01-31')
        .respond(500, { error: 'Server error' });
      
      TransactionService.getTransactions(dateRange).catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transaction list
    - Purpose: Validates behavior when no transactions exist in date range
    - Scenario: API returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should handle empty transaction list', function(done) {
      var dateRange = { startDate: '2024-06-01', endDate: '2024-06-30' };
      var mockTransactions = [];
      $httpBackend.expectGET('/api/transactions?startDate=2024-06-01&endDate=2024-06-30')
        .respond(200, mockTransactions);
      
      TransactionService.getTransactions(dateRange).then(function(data) {
        expect(data).toEqual([]);
        expect(data.length).toBe(0);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle 400 bad request error
    - Purpose: Validates error handling for invalid date parameters
    - Scenario: API returns 400 Bad Request
    - Expected Result: Promise is rejected with error
    */
    it('should handle 400 bad request error', function(done) {
      var dateRange = { startDate: 'invalid', endDate: 'invalid' };
      $httpBackend.expectGET('/api/transactions?startDate=invalid&endDate=invalid')
        .respond(400, { error: 'Invalid date format' });
      
      TransactionService.getTransactions(dateRange).catch(function(error) {
        expect(error.status).toBe(400);
        done();
      });
      
      $httpBackend.flush();
    });
  });

  describe('getMonthlyData method', function() {
    /*
    Test Documentation:
    - Test Name: should successfully fetch monthly summary data
    - Purpose: Validates that getMonthlyData retrieves transaction summary
    - Scenario: API returns successful response with monthly data
    - Expected Result: Promise resolves with monthly summary data
    */
    it('should successfully fetch monthly summary data', function(done) {
      var mockMonthlyData = {
        January: { total: 5000, transactions: 15 },
        February: { total: 6000, transactions: 18 }
      };
      $httpBackend.expectGET('/api/transactions/summary').respond(200, mockMonthlyData);
      
      TransactionService.getMonthlyData().then(function(data) {
        expect(data).toEqual(mockMonthlyData);
        expect(data.January.total).toBe(5000);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise when monthly data fetch fails
    - Purpose: Validates error handling for monthly data retrieval failure
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise when monthly data fetch fails', function(done) {
      $httpBackend.expectGET('/api/transactions/summary')
        .respond(500, { error: 'Server error' });
      
      TransactionService.getMonthlyData().catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty monthly data
    - Purpose: Validates behavior when no monthly data is available
    - Scenario: API returns empty object
    - Expected Result: Promise resolves with empty object
    */
    it('should handle empty monthly data', function(done) {
      var mockMonthlyData = {};
      $httpBackend.expectGET('/api/transactions/summary').respond(200, mockMonthlyData);
      
      TransactionService.getMonthlyData().then(function(data) {
        expect(data).toEqual({});
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle 403 forbidden error on monthly data
    - Purpose: Validates error handling for permission denied
    - Scenario: API returns 403 Forbidden
    - Expected Result: Promise is rejected with error
    */
    it('should handle 403 forbidden error on monthly data', function(done) {
      $httpBackend.expectGET('/api/transactions/summary')
        .respond(403, { error: 'Forbidden' });
      
      TransactionService.getMonthlyData().catch(function(error) {
        expect(error.status).toBe(403);
        done();
      });
      
      $httpBackend.flush();
    });
  });

  describe('getCardWiseSpend method', function() {
    /*
    Test Documentation:
    - Test Name: should successfully fetch card-wise spending data
    - Purpose: Validates that getCardWiseSpend retrieves spending breakdown by card
    - Scenario: API returns successful response with card-wise data
    - Expected Result: Promise resolves with card spending data
    */
    it('should successfully fetch card-wise spending data', function(done) {
      var mockCardWiseData = {
        'VISA-1234': { total: 3000, transactions: 10 },
        'MASTERCARD-5678': { total: 2000, transactions: 8 }
      };
      $httpBackend.expectGET('/api/transactions/by-card').respond(200, mockCardWiseData);
      
      TransactionService.getCardWiseSpend().then(function(data) {
        expect(data).toEqual(mockCardWiseData);
        expect(data['VISA-1234'].total).toBe(3000);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise when card-wise data fetch fails
    - Purpose: Validates error handling for card-wise data retrieval failure
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise when card-wise data fetch fails', function(done) {
      $httpBackend.expectGET('/api/transactions/by-card')
        .respond(500, { error: 'Server error' });
      
      TransactionService.getCardWiseSpend().catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty card-wise data
    - Purpose: Validates behavior when no card data is available
    - Scenario: API returns empty object
    - Expected Result: Promise resolves with empty object
    */
    it('should handle empty card-wise data', function(done) {
      var mockCardWiseData = {};
      $httpBackend.expectGET('/api/transactions/by-card').respond(200, mockCardWiseData);
      
      TransactionService.getCardWiseSpend().then(function(data) {
        expect(data).toEqual({});
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle 401 unauthorized error on card-wise data
    - Purpose: Validates error handling for authentication failure
    - Scenario: API returns 401 Unauthorized
    - Expected Result: Promise is rejected with error
    */
    it('should handle 401 unauthorized error on card-wise data', function(done) {
      $httpBackend.expectGET('/api/transactions/by-card')
        .respond(401, { error: 'Unauthorized' });
      
      TransactionService.getCardWiseSpend().catch(function(error) {
        expect(error.status).toBe(401);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle single card in response
    - Purpose: Validates behavior when only one card has spending
    - Scenario: API returns data for single card
    - Expected Result: Promise resolves with single card data
    */
    it('should handle single card in response', function(done) {
      var mockCardWiseData = {
        'VISA-1234': { total: 5000, transactions: 20 }
      };
      $httpBackend.expectGET('/api/transactions/by-card').respond(200, mockCardWiseData);
      
      TransactionService.getCardWiseSpend().then(function(data) {
        expect(Object.keys(data).length).toBe(1);
        expect(data['VISA-1234'].total).toBe(5000);
        done();
      });
      
      $httpBackend.flush();
    });
  });

  describe('API_BASE constant', function() {
    /*
    Test Documentation:
    - Test Name: should use correct API base URL
    - Purpose: Validates that API_BASE is correctly set to /api
    - Scenario: Service initialization
    - Expected Result: All requests are made to /api endpoints
    */
    it('should use correct API base URL', function(done) {
      var mockData = { test: 'data' };
      $httpBackend.expectGET('/api/transactions/summary').respond(200, mockData);
      
      TransactionService.getMonthlyData().then(function(data) {
        expect(data).toEqual(mockData);
        done();
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getTransactions, getMonthlyData, getCardWiseSpend
- Scenarios covered: successful API calls, error handling (400, 401, 403, 500), empty data responses, parameter passing
- Edge cases: empty transaction lists, empty monthly data, single card scenarios
- Uncovered scenarios: null/undefined date ranges, malformed API responses (defensive programming)
*/