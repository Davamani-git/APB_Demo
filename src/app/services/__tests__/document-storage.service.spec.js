/*
Test Documentation:
- Test Name: DocumentStorageService - getDownloadUrl success
- Purpose: Verify getDownloadUrl calls correct endpoint and returns downloadUrl
- Scenario: GET /api/reports/download/:reportId returns 200 with downloadUrl
- Expected Result: Resolves with downloadUrl string

- Test Name: DocumentStorageService - getDownloadUrl failure
- Purpose: Verify getDownloadUrl propagates HTTP errors
- Scenario: GET /api/reports/download/:reportId returns 500
- Expected Result: Promise rejects

- Test Name: DocumentStorageService - getPreviousReports success (no cache)
- Purpose: Verify getPreviousReports fetches from API and caches result
- Scenario: Cache is empty, GET /api/reports/history returns data
- Expected Result: Returns response.data and stores in cache

- Test Name: DocumentStorageService - getPreviousReports from cache
- Purpose: Verify getPreviousReports returns cached data without HTTP call
- Scenario: Cache already has previousReports
- Expected Result: Returns cached data, no HTTP request made

Coverage Report:
- Functions tested: getDownloadUrl, getPreviousReports
- Scenarios covered: success, HTTP error, cache hit, cache miss
- Uncovered scenarios: cache invalidation, concurrent requests
*/
describe('DocumentStorageService', function() {
  var DocumentStorageService, $httpBackend, $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function(_DocumentStorageService_, _$httpBackend_, _$rootScope_) {
    DocumentStorageService = _DocumentStorageService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getDownloadUrl', function() {
    it('should GET /api/reports/download/:reportId and return downloadUrl', function() {
      var mockResponse = { downloadUrl: 'https://storage.example.com/report123.pdf' };
      $httpBackend.expectGET('/api/reports/download/report123').respond(200, mockResponse);

      var result;
      DocumentStorageService.getDownloadUrl('report123').then(function(url) {
        result = url;
      });
      $httpBackend.flush();
      expect(result).toBe('https://storage.example.com/report123.pdf');
    });

    it('should reject when HTTP request fails', function() {
      $httpBackend.expectGET('/api/reports/download/badId').respond(500, {});

      var rejected = false;
      DocumentStorageService.getDownloadUrl('badId').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });
  });

  describe('getPreviousReports', function() {
    it('should fetch from /api/reports/history when cache is empty', function() {
      var mockReports = [{ id: 1, name: 'Report A' }, { id: 2, name: 'Report B' }];
      $httpBackend.expectGET('/api/reports/history').respond(200, mockReports);

      var result;
      DocumentStorageService.getPreviousReports().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual(mockReports);
    });

    it('should return cached data without making HTTP call on second request', function() {
      var mockReports = [{ id: 1, name: 'Report A' }];
      $httpBackend.expectGET('/api/reports/history').respond(200, mockReports);

      DocumentStorageService.getPreviousReports();
      $httpBackend.flush();

      var result;
      DocumentStorageService.getPreviousReports().then(function(data) {
        result = data;
      });
      $rootScope.$digest();
      expect(result).toEqual(mockReports);
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});
