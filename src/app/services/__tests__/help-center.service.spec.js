/*
Test Documentation:
- Test Name: HelpCenterService - loadCategories
- Purpose: Validates that help categories are fetched and returned successfully.
- Scenario: HTTP GET returns a list of help categories.
- Expected Result: Categories array is populated with valid data.

- Test Name: HelpCenterService - loadCategories error
- Purpose: Validates graceful error handling when category fetch fails.
- Scenario: HTTP GET returns a 500 error.
- Expected Result: Error is caught and an empty array or error message is returned.

- Test Name: HelpCenterService - searchHelpTopics
- Purpose: Validates keyword-based search returns matching help topics.
- Scenario: Valid keyword is provided.
- Expected Result: Matching topics are returned.

- Test Name: HelpCenterService - searchHelpTopics empty keyword
- Purpose: Validates behavior when search keyword is empty.
- Scenario: Empty string is passed as keyword.
- Expected Result: Returns empty array or all topics.

- Test Name: HelpCenterService - getHelpArticle
- Purpose: Validates that a single help article is fetched by ID.
- Scenario: Valid article ID is provided.
- Expected Result: Article object is returned.

- Test Name: HelpCenterService - getHelpArticle not found
- Purpose: Validates error handling when article ID does not exist.
- Scenario: Non-existent article ID is provided.
- Expected Result: 404 error is handled gracefully.

- Test Name: HelpCenterService - getVideoTutorials
- Purpose: Validates that video tutorials list is fetched.
- Scenario: HTTP GET returns list of video tutorials.
- Expected Result: Video tutorials array is populated.

- Test Name: HelpCenterService - getDownloadableMaterials
- Purpose: Validates that downloadable help materials are fetched.
- Scenario: HTTP GET returns list of materials.
- Expected Result: Materials array is populated with name and URL.

- Test Name: HelpCenterService - getChatConfig
- Purpose: Validates that chat configuration is fetched.
- Scenario: HTTP GET returns chat config object.
- Expected Result: Chat config object with endpoint and token is returned.

- Test Name: HelpCenterService - getChatConfig failure
- Purpose: Validates graceful failure when chat config is unavailable.
- Scenario: HTTP GET returns 503.
- Expected Result: Error is handled and meaningful message is returned.
*/

describe('HelpCenterService', function () {
  var HelpCenterService, $httpBackend, $q, $rootScope;

  beforeEach(module('APBApp'));

  beforeEach(inject(function (_HelpCenterService_, _$httpBackend_, _$q_, _$rootScope_) {
    HelpCenterService = _HelpCenterService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // --- loadCategories ---
  describe('loadCategories()', function () {
    it('should return a list of help categories on success', function () {
      var mockCategories = [
        { id: 1, name: 'Getting Started' },
        { id: 2, name: 'FAQs' },
        { id: 3, name: 'How-to Guides' },
        { id: 4, name: 'Video Tutorials' },
        { id: 5, name: 'Help Materials' },
        { id: 6, name: 'Troubleshooting' },
        { id: 7, name: 'Chat Support' }
      ];
      $httpBackend.expectGET('/api/help/categories').respond(200, mockCategories);
      var result;
      HelpCenterService.loadCategories().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(result.length).toBe(7);
      expect(result[0].name).toBe('Getting Started');
    });

    it('should handle server error gracefully when loading categories', function () {
      $httpBackend.expectGET('/api/help/categories').respond(500, { message: 'Internal Server Error' });
      var errorResult;
      HelpCenterService.loadCategories().catch(function (err) {
        errorResult = err;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(errorResult).toBeDefined();
    });

    it('should return an empty array when no categories exist', function () {
      $httpBackend.expectGET('/api/help/categories').respond(200, []);
      var result;
      HelpCenterService.loadCategories().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual([]);
    });
  });

  // --- searchHelpTopics ---
  describe('searchHelpTopics(keyword)', function () {
    it('should return matching topics for a valid keyword', function () {
      var mockTopics = [
        { id: 10, title: 'How to reset password', category: 'FAQs' },
        { id: 11, title: 'How to update profile', category: 'How-to Guides' }
      ];
      $httpBackend.expectGET('/api/help/search?keyword=password').respond(200, mockTopics);
      var result;
      HelpCenterService.searchHelpTopics('password').then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].title).toContain('password');
    });

    it('should return empty array when no topics match the keyword', function () {
      $httpBackend.expectGET('/api/help/search?keyword=xyz123').respond(200, []);
      var result;
      HelpCenterService.searchHelpTopics('xyz123').then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual([]);
    });

    it('should handle empty keyword gracefully', function () {
      $httpBackend.expectGET('/api/help/search?keyword=').respond(200, []);
      var result;
      HelpCenterService.searchHelpTopics('').then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual([]);
    });

    it('should handle search API failure', function () {
      $httpBackend.expectGET('/api/help/search?keyword=error').respond(500, {});
      var errorResult;
      HelpCenterService.searchHelpTopics('error').catch(function (err) {
        errorResult = err;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(errorResult).toBeDefined();
    });
  });

  // --- getHelpArticle ---
  describe('getHelpArticle(id)', function () {
    it('should return a help article for a valid ID', function () {
      var mockArticle = { id: 42, title: 'Getting Started Guide', content: 'Welcome to the product...' };
      $httpBackend.expectGET('/api/help/articles/42').respond(200, mockArticle);
      var result;
      HelpCenterService.getHelpArticle(42).then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(result.id).toBe(42);
      expect(result.title).toBe('Getting Started Guide');
    });

    it('should handle 404 when article is not found', function () {
      $httpBackend.expectGET('/api/help/articles/9999').respond(404, { message: 'Article not found' });
      var errorResult;
      HelpCenterService.getHelpArticle(9999).catch(function (err) {
        errorResult = err;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(errorResult).toBeDefined();
    });

    it('should handle null or undefined article ID', function () {
      var errorResult;
      try {
        HelpCenterService.getHelpArticle(null);
      } catch (e) {
        errorResult = e;
      }
      expect(errorResult).toBeDefined();
    });
  });

  // --- getVideoTutorials ---
  describe('getVideoTutorials()', function () {
    it('should return a list of video tutorials on success', function () {
      var mockVideos = [
        { id: 1, title: 'Intro Video', url: 'https://videos.example.com/intro' },
        { id: 2, title: 'Advanced Features', url: 'https://videos.example.com/advanced' }
      ];
      $httpBackend.expectGET('/api/help/videos').respond(200, mockVideos);
      var result;
      HelpCenterService.getVideoTutorials().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].title).toBe('Intro Video');
    });

    it('should return empty array when no videos are available', function () {
      $httpBackend.expectGET('/api/help/videos').respond(200, []);
      var result;
      HelpCenterService.getVideoTutorials().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual([]);
    });

    it('should handle server error when fetching videos', function () {
      $httpBackend.expectGET('/api/help/videos').respond(503, { message: 'Service Unavailable' });
      var errorResult;
      HelpCenterService.getVideoTutorials().catch(function (err) {
        errorResult = err;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(errorResult).toBeDefined();
    });
  });

  // --- getDownloadableMaterials ---
  describe('getDownloadableMaterials()', function () {
    it('should return downloadable materials on success', function () {
      var mockMaterials = [
        { id: 1, name: 'User Guide', type: 'PDF', url: '/downloads/user-guide.pdf' },
        { id: 2, name: 'Quick Reference', type: 'PDF', url: '/downloads/quick-ref.pdf' },
        { id: 3, name: 'Training Document', type: 'DOCX', url: '/downloads/training.docx' }
      ];
      $httpBackend.expectGET('/api/help/materials').respond(200, mockMaterials);
      var result;
      HelpCenterService.getDownloadableMaterials().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('User Guide');
      expect(result[0].url).toContain('/downloads/');
    });

    it('should handle error when materials endpoint is unavailable', function () {
      $httpBackend.expectGET('/api/help/materials').respond(404, { message: 'Not Found' });
      var errorResult;
      HelpCenterService.getDownloadableMaterials().catch(function (err) {
        errorResult = err;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(errorResult).toBeDefined();
    });

    it('should return empty array when no materials are available', function () {
      $httpBackend.expectGET('/api/help/materials').respond(200, []);
      var result;
      HelpCenterService.getDownloadableMaterials().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual([]);
    });
  });

  // --- getChatConfig ---
  describe('getChatConfig()', function () {
    it('should return chat configuration on success', function () {
      var mockConfig = { endpoint: 'https://chat.example.com/api', token: 'abc123', enabled: true };
      $httpBackend.expectGET('/api/help/chat/config').respond(200, mockConfig);
      var result;
      HelpCenterService.getChatConfig().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(result.endpoint).toBe('https://chat.example.com/api');
      expect(result.enabled).toBe(true);
    });

    it('should handle 503 when chat service is unavailable', function () {
      $httpBackend.expectGET('/api/help/chat/config').respond(503, { message: 'Chat service unavailable' });
      var errorResult;
      HelpCenterService.getChatConfig().catch(function (err) {
        errorResult = err;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(errorResult).toBeDefined();
    });

    it('should handle chat config with enabled flag set to false', function () {
      var mockConfig = { endpoint: '', token: '', enabled: false };
      $httpBackend.expectGET('/api/help/chat/config').respond(200, mockConfig);
      var result;
      HelpCenterService.getChatConfig().then(function (data) {
        result = data;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result.enabled).toBe(false);
    });
  });
});

/*
Coverage Report:
- Functions Tested: loadCategories, searchHelpTopics, getHelpArticle, getVideoTutorials, getDownloadableMaterials, getChatConfig
- Scenarios Covered:
  * Success/200 responses for all service methods
  * Empty array responses
  * 404 Not Found error handling
  * 500 Internal Server Error handling
  * 503 Service Unavailable handling
  * Empty/null input edge cases
  * Boolean flag edge cases (chat enabled/disabled)
- Uncovered Scenarios:
  * Network timeout scenarios
  * Partial/malformed response payloads
  * Concurrent/parallel request handling
*/