/*
Test Documentation:
- Test Name: FileParserService - parseFile with no file
- Purpose: Verify parseFile rejects when no file is provided
- Scenario: Called with null/undefined
- Expected Result: Promise rejects with 'No file provided'

- Test Name: FileParserService - parseFile with invalid file type
- Purpose: Verify parseFile rejects unsupported file types
- Scenario: File with type 'image/png' and name 'test.png'
- Expected Result: Promise rejects with invalid file type message

- Test Name: FileParserService - parseFile with file exceeding size limit
- Purpose: Verify parseFile rejects files larger than 50MB
- Scenario: File size > 50 * 1024 * 1024 bytes
- Expected Result: Promise rejects with size limit message

- Test Name: FileParserService - parseFile with valid CSV file type
- Purpose: Verify parseFile accepts valid CSV MIME type
- Scenario: File with type 'text/csv' and size within limit
- Expected Result: FileReader.readAsArrayBuffer is called

- Test Name: FileParserService - parseFile with valid XLSX extension
- Purpose: Verify parseFile accepts .xlsx extension even with generic MIME type
- Scenario: File with name 'data.xlsx' and application/octet-stream type
- Expected Result: FileReader.readAsArrayBuffer is called

- Test Name: FileParserService - parseFile upload success
- Purpose: Verify parseFile resolves with response data on successful upload
- Scenario: FileReader loads, $http.post resolves
- Expected Result: Resolves with response.data

- Test Name: FileParserService - parseFile upload failure
- Purpose: Verify parseFile rejects with error message on upload failure
- Scenario: FileReader loads, $http.post rejects with error.data.message
- Expected Result: Rejects with server error message

Coverage Report:
- Functions tested: parseFile
- Scenarios covered: null file, invalid type, size exceeded, valid CSV, valid XLSX extension, upload success, upload failure
- Uncovered scenarios: XML file type, reader.onerror path in all browsers
*/
describe('FileParserService', function() {
  var FileParserService, $httpBackend, $rootScope, $q;
  var mockFileReader;

  beforeEach(module('app'));

  beforeEach(inject(function(_FileParserService_, _$httpBackend_, _$rootScope_, _$q_) {
    FileParserService = _FileParserService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  function createMockFile(name, type, size) {
    return {
      name: name,
      type: type,
      size: size || 1024
    };
  }

  describe('parseFile', function() {
    it('should reject with No file provided when called with null', function() {
      var rejected;
      FileParserService.parseFile(null).catch(function(err) {
        rejected = err;
      });
      $rootScope.$digest();
      expect(rejected).toBe('No file provided');
    });

    it('should reject with No file provided when called with undefined', function() {
      var rejected;
      FileParserService.parseFile(undefined).catch(function(err) {
        rejected = err;
      });
      $rootScope.$digest();
      expect(rejected).toBe('No file provided');
    });

    it('should reject with invalid file type message for unsupported MIME and extension', function() {
      var file = createMockFile('image.png', 'image/png', 1024);
      var rejected;
      FileParserService.parseFile(file).catch(function(err) {
        rejected = err;
      });
      $rootScope.$digest();
      expect(rejected).toBe('Invalid file type. Please upload CSV, XLSX, or XML file.');
    });

    it('should reject with size limit message when file exceeds 50MB', function() {
      var file = createMockFile('large.csv', 'text/csv', 51 * 1024 * 1024);
      var rejected;
      FileParserService.parseFile(file).catch(function(err) {
        rejected = err;
      });
      $rootScope.$digest();
      expect(rejected).toBe('File size exceeds 50MB limit.');
    });

    it('should call FileReader.readAsArrayBuffer for valid CSV MIME type', function() {
      var mockReader = {
        readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
        onload: null,
        onerror: null
      };
      spyOn(window, 'FileReader').and.returnValue(mockReader);

      var file = createMockFile('data.csv', 'text/csv', 1024);
      FileParserService.parseFile(file);
      $rootScope.$digest();
      expect(mockReader.readAsArrayBuffer).toHaveBeenCalledWith(file);
    });

    it('should accept .xlsx extension with generic MIME type', function() {
      var mockReader = {
        readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
        onload: null,
        onerror: null
      };
      spyOn(window, 'FileReader').and.returnValue(mockReader);

      var file = createMockFile('data.xlsx', 'application/octet-stream', 2048);
      FileParserService.parseFile(file);
      $rootScope.$digest();
      expect(mockReader.readAsArrayBuffer).toHaveBeenCalledWith(file);
    });

    it('should resolve with response data on successful upload', function() {
      var mockReader = {
        readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
        onload: null,
        onerror: null
      };
      spyOn(window, 'FileReader').and.returnValue(mockReader);

      var file = createMockFile('data.csv', 'text/csv', 1024);
      var resolved;
      FileParserService.parseFile(file).then(function(data) {
        resolved = data;
      });

      $httpBackend.expectPOST('/api/upload').respond(200, { records: 10 });
      mockReader.onload({ target: { result: new ArrayBuffer(8) } });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(resolved).toEqual({ records: 10 });
    });

    it('should reject with server error message when upload fails with error.data.message', function() {
      var mockReader = {
        readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
        onload: null,
        onerror: null
      };
      spyOn(window, 'FileReader').and.returnValue(mockReader);

      var file = createMockFile('data.csv', 'text/csv', 1024);
      var rejected;
      FileParserService.parseFile(file).catch(function(err) {
        rejected = err;
      });

      $httpBackend.expectPOST('/api/upload').respond(400, { message: 'Malformed CSV' });
      mockReader.onload({ target: { result: new ArrayBuffer(8) } });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(rejected).toBe('Malformed CSV');
    });

    it('should reject with Upload failed when upload fails without error.data.message', function() {
      var mockReader = {
        readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
        onload: null,
        onerror: null
      };
      spyOn(window, 'FileReader').and.returnValue(mockReader);

      var file = createMockFile('data.csv', 'text/csv', 1024);
      var rejected;
      FileParserService.parseFile(file).catch(function(err) {
        rejected = err;
      });

      $httpBackend.expectPOST('/api/upload').respond(500, null);
      mockReader.onload({ target: { result: new ArrayBuffer(8) } });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(rejected).toBe('Upload failed');
    });

    it('should reject with Error reading file on FileReader onerror', function() {
      var mockReader = {
        readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
        onload: null,
        onerror: null
      };
      spyOn(window, 'FileReader').and.returnValue(mockReader);

      var file = createMockFile('data.csv', 'text/csv', 1024);
      var rejected;
      FileParserService.parseFile(file).catch(function(err) {
        rejected = err;
      });

      mockReader.onerror();
      $rootScope.$digest();
      expect(rejected).toBe('Error reading file');
    });
  });
});
