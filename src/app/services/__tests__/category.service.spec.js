/*
Test Documentation:
- Test Name: CategoryService getCategories from API
- Purpose: Validates category retrieval from API
- Scenario: When categories are not cached
- Expected Result: Categories are fetched from API and cached
*/
/*
Test Documentation:
- Test Name: CategoryService getCategories from cache
- Purpose: Validates category retrieval from cache
- Scenario: When categories are already cached
- Expected Result: Cached categories are returned without API call
*/
/*
Test Documentation:
- Test Name: CategoryService getCategories error handling
- Purpose: Validates error handling during category fetch
- Scenario: When API request fails
- Expected Result: Error is propagated
*/
/*
Test Documentation:
- Test Name: CategoryService correctCategory success
- Purpose: Validates category correction for a transaction
- Scenario: When correcting a transaction category
- Expected Result: Transaction category is updated successfully
*/
/*
Test Documentation:
- Test Name: CategoryService correctCategory error handling
- Purpose: Validates error handling during category correction
- Scenario: When category correction fails
- Expected Result: Error is propagated
*/
/*
Coverage Report:
- Functions tested: getCategories, correctCategory
- Scenarios covered: fetch from API, fetch from cache, API errors, category correction success/failure
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService, $httpBackend, $cacheFactory, API_CONFIG, cache;

    beforeEach(module('financeApp'));

    beforeEach(inject(function(_CategoryService_, _$httpBackend_, _$cacheFactory_, _API_CONFIG_) {
      CategoryService = _CategoryService_;
      $httpBackend = _$httpBackend_;
      $cacheFactory = _$cacheFactory_;
      API_CONFIG = _API_CONFIG_;

      cache = $cacheFactory.get('categoryCache');
      if (cache) {
        cache.removeAll();
      }
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      if (cache) {
        cache.removeAll();
      }
    });

    describe('getCategories', function() {
      it('should fetch categories from API when not cached', function(done) {
        var categoriesData = [
          { id: 1, name: 'Food', type: 'expense' },
          { id: 2, name: 'Salary', type: 'income' }
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/categories')
          .respond(200, categoriesData);

        CategoryService.getCategories().then(function(data) {
          expect(data).toEqual(categoriesData);
          expect(cache.get('categories')).toEqual(categoriesData);
          done();
        });

        $httpBackend.flush();
      });

      it('should return cached categories when available', function(done) {
        var cachedData = [
          { id: 1, name: 'Food', type: 'expense' },
          { id: 2, name: 'Salary', type: 'income' }
        ];

        cache.put('categories', cachedData);

        CategoryService.getCategories().then(function(data) {
          expect(data).toEqual(cachedData);
          done();
        });
      });

      it('should handle API error when fetching categories', function(done) {
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/categories')
          .respond(500, { error: 'Server error' });

        CategoryService.getCategories().catch(function(error) {
          expect(error.status).toBe(500);
          done();
        });

        $httpBackend.flush();
      });

      it('should cache categories after successful fetch', function(done) {
        var categoriesData = [{ id: 1, name: 'Food' }];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/categories')
          .respond(200, categoriesData);

        CategoryService.getCategories().then(function() {
          var cached = cache.get('categories');
          expect(cached).toEqual(categoriesData);
          done();
        });

        $httpBackend.flush();
      });
    });

    describe('correctCategory', function() {
      it('should correct transaction category successfully', function() {
        var transactionId = 123;
        var categoryId = 5;
        var responseData = { id: 123, categoryId: 5, updated: true };

        $httpBackend.expectPATCH(
          API_CONFIG.baseUrl + '/transactions/' + transactionId + '/category',
          { categoryId: categoryId }
        ).respond(200, responseData);

        CategoryService.correctCategory(transactionId, categoryId).then(function(data) {
          expect(data.id).toBe(123);
          expect(data.categoryId).toBe(5);
          expect(data.updated).toBe(true);
        });

        $httpBackend.flush();
      });

      it('should handle error when correcting category', function() {
        var transactionId = 999;
        var categoryId = 5;

        $httpBackend.expectPATCH(
          API_CONFIG.baseUrl + '/transactions/' + transactionId + '/category',
          { categoryId: categoryId }
        ).respond(404, { error: 'Transaction not found' });

        CategoryService.correctCategory(transactionId, categoryId).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });

      it('should send correct payload for category correction', function() {
        var transactionId = 456;
        var categoryId = 10;

        $httpBackend.expectPATCH(
          API_CONFIG.baseUrl + '/transactions/456/category',
          { categoryId: 10 }
        ).respond(200, {});

        CategoryService.correctCategory(transactionId, categoryId);

        $httpBackend.flush();
      });

      it('should handle validation errors', function() {
        var transactionId = 123;
        var categoryId = null;

        $httpBackend.expectPATCH(
          API_CONFIG.baseUrl + '/transactions/' + transactionId + '/category',
          { categoryId: categoryId }
        ).respond(400, { error: 'Invalid category' });

        CategoryService.correctCategory(transactionId, categoryId).catch(function(error) {
          expect(error.status).toBe(400);
        });

        $httpBackend.flush();
      });
    });
  });
})();