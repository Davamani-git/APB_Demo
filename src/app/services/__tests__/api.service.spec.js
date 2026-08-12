describe('ApiService', function() {
  beforeEach(module('creditCardApp'));
  var ApiService, $httpBackend, $q;

  beforeEach(inject(function(_ApiService_, _$httpBackend_, _$q_) {
    ApiService = _ApiService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('get method', function() {
    /*
    Test Documentation:
    - Test Name: should successfully fetch data from API endpoint
    - Purpose: Validates that the get method makes HTTP GET request and returns response data
    - Scenario: API returns successful response with data
    - Expected Result: Promise resolves with response data
    */
    it('should successfully fetch data from API endpoint', function(done) {
      var mockData = { id: 1, name: 'Test' };
      $httpBackend.expectGET('/api/test').respond(200, mockData);
      
      ApiService.get('/test').then(function(data) {
        expect(data).toEqual(mockData);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should pass query parameters to GET request
    - Purpose: Validates that query parameters are correctly passed in GET request
    - Scenario: get method called with params object
    - Expected Result: HTTP request includes query parameters
    */
    it('should pass query parameters to GET request', function(done) {
      var mockData = { results: [] };
      var params = { page: 1, limit: 10 };
      $httpBackend.expectGET('/api/test?page=1&limit=10').respond(200, mockData);
      
      ApiService.get('/test', params).then(function(data) {
        expect(data).toEqual(mockData);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on GET request error
    - Purpose: Validates error handling when GET request fails
    - Scenario: API returns error response
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on GET request error', function(done) {
      $httpBackend.expectGET('/api/test').respond(500, { error: 'Server error' });
      
      ApiService.get('/test').catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout on GET request
    - Purpose: Validates behavior when network request times out
    - Scenario: HTTP request times out
    - Expected Result: Promise is rejected
    */
    it('should handle network timeout on GET request', function(done) {
      $httpBackend.expectGET('/api/test').respond(0, '');
      
      ApiService.get('/test').catch(function(error) {
        expect(error).toBeDefined();
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty endpoint
    - Purpose: Validates behavior with empty endpoint string
    - Scenario: get method called with empty endpoint
    - Expected Result: Request is made to /api
    */
    it('should handle empty endpoint', function(done) {
      var mockData = {};
      $httpBackend.expectGET('/api').respond(200, mockData);
      
      ApiService.get('').then(function(data) {
        expect(data).toEqual(mockData);
        done();
      });
      
      $httpBackend.flush();
    });
  });

  describe('post method', function() {
    /*
    Test Documentation:
    - Test Name: should successfully post data to API endpoint
    - Purpose: Validates that the post method makes HTTP POST request and returns response data
    - Scenario: API returns successful response after POST
    - Expected Result: Promise resolves with response data
    */
    it('should successfully post data to API endpoint', function(done) {
      var postData = { name: 'Test', value: 100 };
      var mockResponse = { id: 1, name: 'Test', value: 100 };
      $httpBackend.expectPOST('/api/test', postData).respond(201, mockResponse);
      
      ApiService.post('/test', postData).then(function(data) {
        expect(data).toEqual(mockResponse);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on POST request error
    - Purpose: Validates error handling when POST request fails
    - Scenario: API returns error response
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on POST request error', function(done) {
      var postData = { name: 'Test' };
      $httpBackend.expectPOST('/api/test', postData).respond(400, { error: 'Bad request' });
      
      ApiService.post('/test', postData).catch(function(error) {
        expect(error.status).toBe(400);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty data object in POST request
    - Purpose: Validates POST behavior with empty data
    - Scenario: post method called with empty object
    - Expected Result: Request is made with empty object
    */
    it('should handle empty data object in POST request', function(done) {
      var postData = {};
      var mockResponse = { id: 1 };
      $httpBackend.expectPOST('/api/test', postData).respond(201, mockResponse);
      
      ApiService.post('/test', postData).then(function(data) {
        expect(data).toEqual(mockResponse);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle 500 server error on POST
    - Purpose: Validates error handling for server errors
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise is rejected with error
    */
    it('should handle 500 server error on POST', function(done) {
      var postData = { name: 'Test' };
      $httpBackend.expectPOST('/api/test', postData).respond(500, { error: 'Internal server error' });
      
      ApiService.post('/test', postData).catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });
      
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle 403 forbidden error on POST
    - Purpose: Validates error handling for permission denied
    - Scenario: API returns 403 Forbidden
    - Expected Result: Promise is rejected with error
    */
    it('should handle 403 forbidden error on POST', function(done) {
      var postData = { name: 'Test' };
      $httpBackend.expectPOST('/api/test', postData).respond(403, { error: 'Forbidden' });
      
      ApiService.post('/test', postData).catch(function(error) {
        expect(error.status).toBe(403);
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
    - Expected Result: Requests are made to /api endpoint
    */
    it('should use correct API base URL', function(done) {
      var mockData = { test: 'data' };
      $httpBackend.expectGET('/api/endpoint').respond(200, mockData);
      
      ApiService.get('/endpoint').then(function(data) {
        expect(data).toEqual(mockData);
        done();
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: get, post
- Scenarios covered: successful GET/POST, error handling (400, 403, 500), network issues, empty parameters, query parameters
- Edge cases: empty endpoint, empty data object
- Uncovered scenarios: null/undefined parameters (defensive programming)
*/