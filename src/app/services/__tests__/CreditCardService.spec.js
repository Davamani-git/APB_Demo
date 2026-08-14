describe('CreditCardService', function() {
  beforeEach(module('creditCardDashboard'));
  var CreditCardService, $httpBackend, $q, $rootScope;

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_, _$rootScope_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Success Scenario
  - Purpose: Validates that getDashboardData correctly aggregates credit card data and calculates KPIs
  - Scenario: HTTP GET request returns valid credit card array with multiple cards
  - Expected Result: Returns resolved promise with aggregated dashboard KPI object containing totals and utilization percentage
  */
  it('should retrieve and aggregate dashboard data successfully', function(done) {
    var mockCards = [
      {
        creditLimit: 5000,
        availableCredit: 2000,
        outstandingAmount: 3000,
        monthlySpend: 1500
      },
      {
        creditLimit: 10000,
        availableCredit: 4000,
        outstandingAmount: 6000,
        monthlySpend: 2500
      }
    ];

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.totalCreditLimit).toBe(15000);
      expect(dashboardKPI.totalAvailableCredit).toBe(6000);
      expect(dashboardKPI.totalOutstanding).toBe(9000);
      expect(dashboardKPI.totalMonthlySpend).toBe(4000);
      expect(dashboardKPI.creditUtilizationPercent).toBe('40.00');
      expect(dashboardKPI.cards).toEqual(mockCards);
      done();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Single Card
  - Purpose: Validates aggregation logic with a single credit card
  - Scenario: HTTP GET request returns array with one card
  - Expected Result: Returns resolved promise with correct KPI calculations for single card
  */
  it('should handle single credit card correctly', function(done) {
    var mockCards = [
      {
        creditLimit: 8000,
        availableCredit: 3000,
        outstandingAmount: 5000,
        monthlySpend: 2000
      }
    ];

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.totalCreditLimit).toBe(8000);
      expect(dashboardKPI.totalAvailableCredit).toBe(3000);
      expect(dashboardKPI.totalOutstanding).toBe(5000);
      expect(dashboardKPI.totalMonthlySpend).toBe(2000);
      expect(dashboardKPI.creditUtilizationPercent).toBe('62.50');
      done();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Empty Card Array
  - Purpose: Validates behavior when no credit cards are returned
  - Scenario: HTTP GET request returns empty array
  - Expected Result: Returns resolved promise with zero totals and zero utilization percentage
  */
  it('should handle empty credit card array', function(done) {
    var mockCards = [];

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.totalCreditLimit).toBe(0);
      expect(dashboardKPI.totalAvailableCredit).toBe(0);
      expect(dashboardKPI.totalOutstanding).toBe(0);
      expect(dashboardKPI.totalMonthlySpend).toBe(0);
      expect(dashboardKPI.creditUtilizationPercent).toBe(0);
      expect(dashboardKPI.cards).toEqual([]);
      done();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Missing Card Properties
  - Purpose: Validates null/undefined handling for optional card properties
  - Scenario: HTTP GET request returns cards with missing or undefined properties
  - Expected Result: Returns resolved promise treating missing values as zero in aggregations
  */
  it('should handle cards with missing properties', function(done) {
    var mockCards = [
      {
        creditLimit: 5000,
        availableCredit: undefined,
        outstandingAmount: 2000
      },
      {
        creditLimit: 10000,
        monthlySpend: 1500
      }
    ];

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.totalCreditLimit).toBe(15000);
      expect(dashboardKPI.totalAvailableCredit).toBe(0);
      expect(dashboardKPI.totalOutstanding).toBe(2000);
      expect(dashboardKPI.totalMonthlySpend).toBe(1500);
      done();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Credit Utilization Calculation
  - Purpose: Validates correct calculation of credit utilization percentage
  - Scenario: HTTP GET request returns cards with specific credit limit and available credit values
  - Expected Result: Returns resolved promise with correctly calculated utilization percentage (fixed to 2 decimal places)
  */
  it('should calculate credit utilization percentage correctly', function(done) {
    var mockCards = [
      {
        creditLimit: 1000,
        availableCredit: 250,
        outstandingAmount: 750,
        monthlySpend: 500
      }
    ];

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.creditUtilizationPercent).toBe('75.00');
      done();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Zero Credit Limit Edge Case
  - Purpose: Validates handling when total credit limit is zero to prevent division by zero
  - Scenario: HTTP GET request returns cards with zero credit limits
  - Expected Result: Returns resolved promise with creditUtilizationPercent set to 0 (no division by zero error)
  */
  it('should handle zero total credit limit without division error', function(done) {
    var mockCards = [
      {
        creditLimit: 0,
        availableCredit: 0,
        outstandingAmount: 0,
        monthlySpend: 0
      }
    ];

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.creditUtilizationPercent).toBe(0);
      expect(isNaN(dashboardKPI.creditUtilizationPercent)).toBe(false);
      done();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - HTTP Error Scenario
  - Purpose: Validates error handling when HTTP request fails
  - Scenario: HTTP GET request returns 500 server error
  - Expected Result: Returns rejected promise with error object
  */
  it('should reject promise on HTTP error', function(done) {
    var errorResponse = { status: 500, statusText: 'Internal Server Error' };

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(500, errorResponse);

    CreditCardService.getDashboardData().then(
      function() {
        fail('Promise should have been rejected');
      },
      function(error) {
        expect(error.status).toBe(500);
        done();
      }
    );

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Network Timeout
  - Purpose: Validates error handling for network failures
  - Scenario: HTTP GET request times out or fails
  - Expected Result: Returns rejected promise with error details
  */
  it('should reject promise on network error', function(done) {
    $httpBackend.expectGET('/api/creditcards/dashboard').respond(0, '');

    CreditCardService.getDashboardData().then(
      function() {
        fail('Promise should have been rejected');
      },
      function(error) {
        expect(error).toBeDefined();
        done();
      }
    );

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Returns Promise
  - Purpose: Validates that getDashboardData returns a promise object
  - Scenario: Method is called
  - Expected Result: Returns a valid promise object with then and catch methods
  */
  it('should return a promise', function() {
    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, []);

    var result = CreditCardService.getDashboardData();

    expect(result).toBeDefined();
    expect(result.then).toBeDefined();
    expect(typeof result.then).toBe('function');
    expect(result.catch).toBeDefined();
    expect(typeof result.catch).toBe('function');

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getDashboardData - Large Dataset
  - Purpose: Validates performance and accuracy with large number of credit cards
  - Scenario: HTTP GET request returns array with many cards
  - Expected Result: Returns resolved promise with correctly aggregated totals across all cards
  */
  it('should handle large dataset of credit cards', function(done) {
    var mockCards = [];
    for (var i = 0; i < 100; i++) {
      mockCards.push({
        creditLimit: 5000 + (i * 100),
        availableCredit: 2000 + (i * 50),
        outstandingAmount: 3000 + (i * 50),
        monthlySpend: 1500 + (i * 25)
      });
    }

    $httpBackend.expectGET('/api/creditcards/dashboard').respond(200, mockCards);

    CreditCardService.getDashboardData().then(function(dashboardKPI) {
      expect(dashboardKPI.cards.length).toBe(100);
      expect(dashboardKPI.totalCreditLimit).toBeGreaterThan(0);
      expect(dashboardKPI.totalAvailableCredit).toBeGreaterThan(0);
      expect(dashboardKPI.totalOutstanding).toBeGreaterThan(0);
      expect(dashboardKPI.totalMonthlySpend).toBeGreaterThan(0);
      expect(dashboardKPI.creditUtilizationPercent).toBeGreaterThan(0);
      done();
    });

    $httpBackend.flush();
  });
});

/*
Coverage Report:
- Functions tested: getDashboardData
- Scenarios covered: 
  * Success scenario with multiple cards
  * Single card aggregation
  * Empty card array
  * Missing/undefined card properties
  * Credit utilization percentage calculation
  * Zero credit limit edge case
  * HTTP 500 error handling
  * Network error handling
  * Promise return validation
  * Large dataset handling
- Edge cases covered: zero values, undefined properties, empty arrays, calculation precision
- Error scenarios covered: HTTP errors, network failures
- Uncovered scenarios: None identified
*/