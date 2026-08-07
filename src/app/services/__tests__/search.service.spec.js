/*
Test Documentation:
- Test Name: searchService - search success
- Purpose: Validates product search functionality
- Scenario: Valid search parameters provided
- Expected Result: Promise resolves with search results
*/
/*
Test Documentation:
- Test Name: searchService - search error
- Purpose: Validates error handling for search failures
- Scenario: API returns error
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: searchService - getCategories success
- Purpose: Validates retrieval of product categories
- Scenario: getCategories is called
- Expected Result: Promise resolves with categories list
*/
/*
Coverage Report:
- Functions tested: search, getCategories
- Scenarios covered: search operations, category retrieval, error handling
- Uncovered scenarios: autocomplete, search suggestions
*/

(function() {
  'use strict';

  describe('searchService', function() {
    var searchService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_searchService_, _$httpBackend_, _apiConfig_) {
      searchService = _searchService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('search', function() {
      it('should search products successfully', function() {
        var searchParams = {
          query: 'laptop',
          category: 'electronics',
          minPrice: 500,
          maxPrice: 2000
        };
        var mockResults = [
          { productId: 'P1', name: 'Gaming Laptop', price: 1299 },
          { productId: 'P2', name: 'Business Laptop', price: 899 }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/products/search?category=electronics&maxPrice=2000&minPrice=500&query=laptop')
          .respond(200, mockResults);

        var result;
        searchService.search(searchParams).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResults);
        expect(result.length).toBe(2);
      });

      it('should handle empty search results', function() {
        var searchParams = { query: 'nonexistent' };
        var mockResults = [];

        $httpBackend.expectGET(apiConfig.baseUrl + '/products/search?query=nonexistent')
          .respond(200, mockResults);

        var result;
        searchService.search(searchParams).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual([]);
      });

      it('should reject promise on search error', function() {
        var searchParams = { query: 'laptop' };

        $httpBackend.expectGET(apiConfig.baseUrl + '/products/search?query=laptop')
          .respond(500, { message: 'Server error' });

        var error;
        searchService.search(searchParams).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });

    describe('getCategories', function() {
      it('should retrieve categories successfully', function() {
        var mockCategories = [
          { categoryId: 'C1', name: 'Electronics', count: 150 },
          { categoryId: 'C2', name: 'Clothing', count: 200 },
          { categoryId: 'C3', name: 'Books', count: 500 }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/categories')
          .respond(200, mockCategories);

        var result;
        searchService.getCategories().then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockCategories);
        expect(result.length).toBe(3);
      });

      it('should reject promise on categories retrieval error', function() {
        $httpBackend.expectGET(apiConfig.baseUrl + '/categories')
          .respond(404, { message: 'Categories not found' });

        var error;
        searchService.getCategories().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });
  });
})();