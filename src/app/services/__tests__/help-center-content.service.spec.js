/*
Test Documentation:
- Test Name: HelpCenterContentService Tests
- Purpose: Validate retrieval, categorization, filtering, and error handling of help content including articles, FAQs, how-to guides, video tutorials, downloadable materials, and troubleshooting content.
- Scenario: Successful content fetch, empty results, network error, unsupported category, null/undefined inputs.
- Expected Result: Content is returned in correct structure; errors are handled with meaningful messages; empty arrays returned for no results.
*/

describe('HelpCenterContentService', function () {
  var HelpCenterContentService;
  var $httpBackend;
  var $rootScope;
  var API_BASE = '/api/help-center';

  beforeEach(module('APBDemoApp'));

  beforeEach(inject(function (_HelpCenterContentService_, _$httpBackend_, _$rootScope_) {
    HelpCenterContentService = _HelpCenterContentService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // --- FR3, FR4 ---
  describe('getCategories()', function () {

    it('should return all defined help content categories', function () {
      var mockCategories = [
        'Getting Started', 'FAQs', 'How-to Guides',
        'Video Tutorials', 'Help Materials', 'Troubleshooting',
        'Chat Support', 'Search Help'
      ];
      $httpBackend.expectGET(API_BASE + '/categories').respond(200, mockCategories);
      var result;
      HelpCenterContentService.getCategories().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(8);
      expect(result).toContain('FAQs');
      expect(result).toContain('Getting Started');
      expect(result).toContain('Video Tutorials');
    });

    it('should return an empty array when no categories are available', function () {
      $httpBackend.expectGET(API_BASE + '/categories').respond(200, []);
      var result;
      HelpCenterContentService.getCategories().then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject with error message on server failure', function () {
      $httpBackend.expectGET(API_BASE + '/categories').respond(500, { message: 'Internal Server Error' });
      var error;
      HelpCenterContentService.getCategories().catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  // --- FR4, AC2 ---
  describe('getContentByCategory(category)', function () {

    it('should return articles for a valid category', function () {
      var mockArticles = [{ id: 1, title: 'Getting Started Guide', type: 'article' }];
      $httpBackend.expectGET(API_BASE + '/content?category=Getting%20Started').respond(200, mockArticles);
      var result;
      HelpCenterContentService.getContentByCategory('Getting Started').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('article');
    });

    it('should return empty array for a category with no content', function () {
      $httpBackend.expectGET(API_BASE + '/content?category=EmptyCategory').respond(200, []);
      var result;
      HelpCenterContentService.getContentByCategory('EmptyCategory').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject when category is null', function () {
      var error;
      HelpCenterContentService.getContentByCategory(null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid category');
    });

    it('should reject when category is undefined', function () {
      var error;
      HelpCenterContentService.getContentByCategory(undefined).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid category');
    });

    it('should reject when category is an empty string', function () {
      var error;
      HelpCenterContentService.getContentByCategory('').catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid category');
    });

    it('should handle 404 response for unknown category', function () {
      $httpBackend.expectGET(API_BASE + '/content?category=Unknown').respond(404, { message: 'Not Found' });
      var error;
      HelpCenterContentService.getContentByCategory('Unknown').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should return multiple content types for FAQs category', function () {
      var mockContent = [
        { id: 1, title: 'FAQ 1', type: 'faq' },
        { id: 2, title: 'FAQ 2', type: 'faq' }
      ];
      $httpBackend.expectGET(API_BASE + '/content?category=FAQs').respond(200, mockContent);
      var result;
      HelpCenterContentService.getContentByCategory('FAQs').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(2);
    });
  });

  // --- FR8, AC6 ---
  describe('searchContent(keyword)', function () {

    it('should return matching results for a valid keyword', function () {
      var mockResults = [
        { id: 1, title: 'Setup Guide', type: 'article' },
        { id: 2, title: 'Setup Video', type: 'video' }
      ];
      $httpBackend.expectGET(API_BASE + '/search?q=setup').respond(200, mockResults);
      var result;
      HelpCenterContentService.searchContent('setup').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result.length).toBe(2);
      expect(result[0].type).toBe('article');
      expect(result[1].type).toBe('video');
    });

    it('should return empty array when no results match the keyword', function () {
      $httpBackend.expectGET(API_BASE + '/search?q=xyznotfound').respond(200, []);
      var result;
      HelpCenterContentService.searchContent('xyznotfound').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject when keyword is null', function () {
      var error;
      HelpCenterContentService.searchContent(null).catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid keyword');
    });

    it('should reject when keyword is an empty string', function () {
      var error;
      HelpCenterContentService.searchContent('').catch(function (err) { error = err; });
      $rootScope.$digest();
      expect(error).toContain('Invalid keyword');
    });

    it('should handle special characters in keyword gracefully', function () {
      $httpBackend.expectGET(API_BASE + '/search?q=%3Cscript%3E').respond(200, []);
      var result;
      HelpCenterContentService.searchContent('<script>').then(function (data) { result = data; });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should handle server error during search', function () {
      $httpBackend.expectGET(API_BASE + '/search?q=error').respond(503, { message: 'Service Unavailable' });
      var error;
      HelpCenterContentService.searchContent('error').catch(function (err) { error = err; });
      $httpBackend.flush();
      expect(error).toBeDefined();
    });

    it('should trim whitespace from keyword before searching', function () {
      $httpBackend.expectGET(API_BASE + '/search?q=setup').respond(200, []);
      HelpCenterContentService.searchContent('  setup  ');
      $httpBackend.flush();
    });
  });

  // --- FR13 ---
  describe('filterContentByType(contentList, type)', function () {

    var mockContentList;

    beforeEach(function () {
      mockContentList = [
        { id: 1, title: 'Article 1', type: 'article' },
        { id: 2, title: 'Video 1', type: 'video' },
        { id: 3, title: 'PDF 1', type: 'downloadable' },
        { id: 4, title: 'Chat Guide', type: 'chat' }
      ];
    });

    it('should filter and return only articles', function () {
      var result = HelpCenterContentService.filterContentByType(mockContentList, 'article');
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('article');
    });

    it('should filter and return only videos', function () {
      var result = HelpCenterContentService.filterContentByType(mockContentList, 'video');
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('video');
    });

    it('should return empty array when no items match the type', function () {
      var result = HelpCenterContentService.filterContentByType(mockContentList, 'unknown');
      expect(result).toEqual([]);
    });

    it('should return empty array when content list is empty', function () {
      var result = HelpCenterContentService.filterContentByType([], 'article');
      expect(result).toEqual([]);
    });

    it('should return empty array when content list is null', function () {
      var result = HelpCenterContentService.filterContentByType(null, 'article');
      expect(result).toEqual([]);
    });

    it('should return all items when type is not specified', function () {
      var result = HelpCenterContentService.filterContentByType(mockContentList, null);
      expect(result.length).toBe(4);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCategories, getContentByCategory, searchContent, filterContentByType
  - Scenarios covered: success, empty results, null/undefined/empty inputs, server errors (500, 404, 503), special characters, whitespace trimming, type filtering
  - FR coverage: FR3, FR4, FR8, FR13
  - AC coverage: AC2, AC6
  - Uncovered scenarios: pagination, multi-language content (FR15), analytics tracking (FR14)
  */
});
