describe('DeliveryPartnerService', function() {
  beforeEach(module('foodDeliveryApp'));
  var DeliveryPartnerService, $httpBackend, $q;

  beforeEach(inject(function(_DeliveryPartnerService_, _$httpBackend_, _$q_) {
    DeliveryPartnerService = _DeliveryPartnerService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: should fetch delivery partner assignment successfully
  - Purpose: Validates successful retrieval of delivery partner data
  - Scenario: HTTP GET request returns valid partner data
  - Expected Result: Partner data is returned and cached
  */
  it('should fetch delivery partner assignment successfully', function() {
    var orderId = 'order123';
    var mockPartner = {
      id: 'partner1',
      name: 'John Doe',
      phone: '5551234567'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(200, mockPartner);
    var result;
    DeliveryPartnerService.getPartnerAssignment(orderId).then(function(partner) {
      result = partner;
    });
    $httpBackend.flush();
    expect(result.name).toBe('John Doe');
    expect(result.phone).toBe('***-***-7567');
  });

  /*
  Test Documentation:
  - Test Name: should return cached partner data on subsequent calls
  - Purpose: Validates caching mechanism to avoid redundant API calls
  - Scenario: Second request for same orderId should return cached data
  - Expected Result: Cached data returned without HTTP request
  */
  it('should return cached partner data on subsequent calls', function() {
    var orderId = 'order123';
    var mockPartner = {
      id: 'partner1',
      name: 'John Doe',
      phone: '5551234567'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(200, mockPartner);
    DeliveryPartnerService.getPartnerAssignment(orderId);
    $httpBackend.flush();
    var result;
    DeliveryPartnerService.getPartnerAssignment(orderId).then(function(partner) {
      result = partner;
    });
    expect(result.phone).toBe('***-***-7567');
  });

  /*
  Test Documentation:
  - Test Name: should mask phone number correctly
  - Purpose: Validates phone number masking for privacy
  - Scenario: Partner data contains phone number in format XXX-XXX-XXXX
  - Expected Result: Phone number masked as ***-***-XXXX
  */
  it('should mask phone number correctly', function() {
    var orderId = 'order123';
    var mockPartner = {
      id: 'partner1',
      name: 'Jane Smith',
      phone: '4155551234'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(200, mockPartner);
    var result;
    DeliveryPartnerService.getPartnerAssignment(orderId).then(function(partner) {
      result = partner;
    });
    $httpBackend.flush();
    expect(result.phone).toBe('***-***-1234');
  });

  /*
  Test Documentation:
  - Test Name: should handle missing phone number
  - Purpose: Validates graceful handling when phone is undefined
  - Scenario: Partner data does not contain phone field
  - Expected Result: Partner data returned without error
  */
  it('should handle missing phone number', function() {
    var orderId = 'order123';
    var mockPartner = {
      id: 'partner1',
      name: 'Bob Wilson'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(200, mockPartner);
    var result;
    DeliveryPartnerService.getPartnerAssignment(orderId).then(function(partner) {
      result = partner;
    });
    $httpBackend.flush();
    expect(result.name).toBe('Bob Wilson');
    expect(result.phone).toBeUndefined();
  });

  /*
  Test Documentation:
  - Test Name: should return cached data on HTTP error
  - Purpose: Validates fallback to cached data during network failures
  - Scenario: HTTP request fails but cached data exists
  - Expected Result: Cached data returned instead of error
  */
  it('should return cached data on HTTP error', function() {
    var orderId = 'order123';
    var mockPartner = {
      id: 'partner1',
      name: 'John Doe',
      phone: '5551234567'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(200, mockPartner);
    DeliveryPartnerService.getPartnerAssignment(orderId);
    $httpBackend.flush();
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(500, 'Server Error');
    var result;
    DeliveryPartnerService.getPartnerAssignment(orderId).then(function(partner) {
      result = partner;
    });
    $httpBackend.flush();
    expect(result.name).toBe('John Doe');
  });

  /*
  Test Documentation:
  - Test Name: should reject promise when no cache and HTTP error
  - Purpose: Validates error handling when cache is empty
  - Scenario: HTTP request fails and no cached data available
  - Expected Result: Promise rejected with error
  */
  it('should reject promise when no cache and HTTP error', function() {
    var orderId = 'order456';
    $httpBackend.expectGET('/api/orders/' + orderId + '/delivery-partner')
      .respond(500, 'Server Error');
    var error;
    DeliveryPartnerService.getPartnerAssignment(orderId).catch(function(err) {
      error = err;
    });
    $httpBackend.flush();
    expect(error).toBeDefined();
  });

  /*
  Coverage Report:
  - Functions tested: getPartnerAssignment
  - Scenarios covered: successful fetch, caching, phone masking, missing phone, error with cache, error without cache
  - Edge cases: undefined phone, server errors, cache hits
  - Uncovered scenarios: network timeout, malformed JSON response
  */
});
