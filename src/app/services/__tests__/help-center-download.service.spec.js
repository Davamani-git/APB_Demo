/*
Test Documentation:
- Test Name: HelpCenterDownloadService Tests
- Purpose: Validate retrieval of downloadable materials, format validation (PDF/DOCX), broken link detection, and error handling for unavailable downloads.
- Scenario: Successful download metadata retrieval, unsupported format, broken link, null input, server error.
- Expected Result: Valid download links returned; broken/unavailable links surface meaningful errors; unsupported formats rejected.
*/

describe('HelpCenterDownloadService', function () {
  var HelpCenterDownloadService;
  var $httpBackend;
  var $rootScope;
  var API_BASE = '/api/help-center/downloads';

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterDownloadService_, _$httpBackend_, _$rootScope_) {
    HelpCenterDownloadService = _HelpCenterDownloadService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // --- FR6, AC4 ---
  describe('getDownloadableById(materialId)', function () {

    it('should return download metadata for a valid material ID', function () {
      var mockMaterial = { id: 'd001', title: 'User Guide', format: 'PDF', url: 'https://cdn.example.com/user-guide.pdf' };
      $httpBackend.expectGET(API_BASE + '/d001').respond(200, mockMaterial);
      var result;
      HelpCenterDownloadService.getDownloadableById('d001').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.format).toBe('PDF');
      expect(result.url).toContain('https');
    });

    it('should reject when material ID does not exist', function () {
      $httpBackend.expectGET(API_BASE + '/invalid').respond(404, { message: 'Material not found' });
      var error;
      HelpCenterDownloadService.getDownloadableById('invalid').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should reject when materialId is null', function () {
      var error;
      HelpCenterDownloadService.getDownloadableById(null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid material ID');
    });

    it('should reject when materialId is undefined', function () {
      var error;
      HelpCenterDownloadService.getDownloadableById(undefined).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid material ID');
    });

    it('should reject when materialId is empty string', function () {
      var error;
      HelpCenterDownloadService.getDownloadableById('').catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid material ID');
    });

    it('should handle server error gracefully', function () {
      $httpBackend.expectGET(API_BASE + '/d002').respond(500, { message: 'Server Error' });
      var error;
      HelpCenterDownloadService.getDownloadableById('d002').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  // --- FR6, AC4 ---
  describe('validateFormat(format)', function () {

    it('should return true for PDF format', function () {
      expect(HelpCenterDownloadService.validateFormat('PDF')).toBe(true);
    });

    it('should return true for DOCX format', function () {
      expect(HelpCenterDownloadService.validateFormat('DOCX')).toBe(true);
    });

    it('should return false for unsupported format', function () {
      expect(HelpCenterDownloadService.validateFormat('EXE')).toBe(false);
    });

    it('should return false for null format', function () {
      expect(HelpCenterDownloadService.validateFormat(null)).toBe(false);
    });

    it('should return false for undefined format', function () {
      expect(HelpCenterDownloadService.validateFormat(undefined)).toBe(false);
    });

    it('should return false for empty string format', function () {
      expect(HelpCenterDownloadService.validateFormat('')).toBe(false);
    });

    it('should be case-insensitive for valid formats', function () {
      expect(HelpCenterDownloadService.validateFormat('pdf')).toBe(true);
      expect(HelpCenterDownloadService.validateFormat('docx')).toBe(true);
    });
  });

  // --- FR6, AC4 ---
  describe('getAllDownloadables()', function () {

    it('should return list of all downloadable materials', function () {
      var mockMaterials = [
        { id: 'd001', title: 'User Guide', format: 'PDF' },
        { id: 'd002', title: 'Quick Reference', format: 'DOCX' }
      ];
      $httpBackend.expectGET(API_BASE).respond(200, mockMaterials);
      var result;
      HelpCenterDownloadService.getAllDownloadables().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(2);
    });

    it('should return empty array when no materials are available', function () {
      $httpBackend.expectGET(API_BASE).respond(200, []);
      var result;
      HelpCenterDownloadService.getAllDownloadables().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should handle server error when fetching all downloadables', function () {
      $httpBackend.expectGET(API_BASE).respond(500, { message: 'Internal Server Error' });
      var error;
      HelpCenterDownloadService.getAllDownloadables().catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  // --- FR11, AC8 ---
  describe('checkLinkValidity(url)', function () {

    it('should return true for a valid HTTPS URL', function () {
      expect(HelpCenterDownloadService.checkLinkValidity('https://cdn.example.com/file.pdf')).toBe(true);
    });

    it('should return false for a non-HTTPS URL', function () {
      expect(HelpCenterDownloadService.checkLinkValidity('http://cdn.example.com/file.pdf')).toBe(false);
    });

    it('should return false for null URL', function () {
      expect(HelpCenterDownloadService.checkLinkValidity(null)).toBe(false);
    });

    it('should return false for undefined URL', function () {
      expect(HelpCenterDownloadService.checkLinkValidity(undefined)).toBe(false);
    });

    it('should return false for empty string URL', function () {
      expect(HelpCenterDownloadService.checkLinkValidity('')).toBe(false);
    });

    it('should return false for malformed URL', function () {
      expect(HelpCenterDownloadService.checkLinkValidity('not-a-url')).toBe(false);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getDownloadableById, validateFormat, getAllDownloadables, checkLinkValidity
  - Scenarios covered: valid ID, invalid ID, null/undefined/empty inputs, server errors, format validation (PDF/DOCX/unsupported), case-insensitivity, HTTPS validation, malformed URLs
  - FR coverage: FR6, FR11
  - AC coverage: AC4, AC8
  - US coverage: US5
  - Uncovered scenarios: file size validation, download progress tracking
  */
});
