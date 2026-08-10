/*
Test Documentation:
- Test Name: ProductService - getProducts - success scenario
- Purpose: Validates that getProducts returns all products for a seller
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with products array
*/
/*
Test Documentation:
- Test Name: ProductService - getProducts - error scenario
- Purpose: Validates error handling when getProducts fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: ProductService - getProduct - success scenario
- Purpose: Validates that getProduct returns a specific product
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with product data
*/
/*
Test Documentation:
- Test Name: ProductService - getProduct - error scenario
- Purpose: Validates error handling when getProduct fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: ProductService - createProduct - success scenario
- Purpose: Validates that createProduct creates a new product
- Scenario: HTTP POST request succeeds
- Expected Result: Promise resolves with created product
*/
/*
Test Documentation:
- Test Name: ProductService - createProduct - error scenario
- Purpose: Validates error handling when createProduct fails
- Scenario: HTTP POST request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: ProductService - updateProduct - success scenario
- Purpose: Validates that updateProduct updates product data
- Scenario: HTTP PUT request succeeds
- Expected Result: Promise resolves with updated product
*/
/*
Test Documentation:
- Test Name: ProductService - updateProduct - error scenario
- Purpose: Validates error handling when updateProduct fails
- Scenario: HTTP PUT request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: ProductService - deleteProduct - success scenario
- Purpose: Validates that deleteProduct removes a product
- Scenario: HTTP DELETE request succeeds
- Expected Result: Promise resolves with deletion confirmation
*/
/*
Test Documentation:
- Test Name: ProductService - deleteProduct - error scenario
- Purpose: Validates error handling when deleteProduct fails
- Scenario: HTTP DELETE request fails
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: getProducts, getProduct, createProduct, updateProduct, deleteProduct
- Scenarios covered: success responses, error handling for all CRUD operations
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('ProductService', function() {
    var ProductService, $httpBackend, $q;
    var apiBase = '/api/products';

    beforeEach(module('app.sellerDashboard'));

    beforeEach(inject(function(_ProductService_, _$httpBackend_, _$q_) {
      ProductService = _ProductService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getProducts', function() {
      it('should return all products for a seller', function() {
        var sellerId = 'seller123';
        var mockResponse = [
          { productId: 'p1', name: 'Product 1', price: 100 },
          { productId: 'p2', name: 'Product 2', price: 200 }
        ];

        $httpBackend.expectGET(apiBase + '?sellerId=' + sellerId)
          .respond(200, mockResponse);

        ProductService.getProducts(sellerId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.length).toBe(2);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getProducts fails', function() {
        var sellerId = 'seller123';

        $httpBackend.expectGET(apiBase + '?sellerId=' + sellerId)
          .respond(500, { message: 'Server error' });

        ProductService.getProducts(sellerId).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('getProduct', function() {
      it('should return a specific product', function() {
        var productId = 'prod123';
        var mockResponse = { productId: productId, name: 'Test Product', price: 150 };

        $httpBackend.expectGET(apiBase + '/' + productId)
          .respond(200, mockResponse);

        ProductService.getProduct(productId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.productId).toBe(productId);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getProduct fails', function() {
        var productId = 'prod123';

        $httpBackend.expectGET(apiBase + '/' + productId)
          .respond(404, { message: 'Product not found' });

        ProductService.getProduct(productId).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });
    });

    describe('createProduct', function() {
      it('should create a new product', function() {
        var productData = { name: 'New Product', price: 250, sellerId: 'seller123' };
        var mockResponse = { productId: 'p123', name: 'New Product', price: 250 };

        $httpBackend.expectPOST(apiBase, productData)
          .respond(201, mockResponse);

        ProductService.createProduct(productData).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.productId).toBeDefined();
        });

        $httpBackend.flush();
      });

      it('should reject promise when createProduct fails', function() {
        var productData = { name: 'New Product', price: 250 };

        $httpBackend.expectPOST(apiBase, productData)
          .respond(400, { message: 'Invalid product data' });

        ProductService.createProduct(productData).catch(function(error) {
          expect(error.status).toBe(400);
        });

        $httpBackend.flush();
      });
    });

    describe('updateProduct', function() {
      it('should update product data', function() {
        var productId = 'prod123';
        var productData = { name: 'Updated Product', price: 300 };
        var mockResponse = { productId: productId, name: 'Updated Product', price: 300 };

        $httpBackend.expectPUT(apiBase + '/' + productId, productData)
          .respond(200, mockResponse);

        ProductService.updateProduct(productId, productData).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.name).toBe('Updated Product');
        });

        $httpBackend.flush();
      });

      it('should reject promise when updateProduct fails', function() {
        var productId = 'prod123';
        var productData = { name: 'Updated Product', price: 300 };

        $httpBackend.expectPUT(apiBase + '/' + productId, productData)
          .respond(403, { message: 'Forbidden' });

        ProductService.updateProduct(productId, productData).catch(function(error) {
          expect(error.status).toBe(403);
        });

        $httpBackend.flush();
      });
    });

    describe('deleteProduct', function() {
      it('should delete a product', function() {
        var productId = 'prod123';
        var mockResponse = { message: 'Product deleted successfully' };

        $httpBackend.expectDELETE(apiBase + '/' + productId)
          .respond(200, mockResponse);

        ProductService.deleteProduct(productId).then(function(data) {
          expect(data).toEqual(mockResponse);
        });

        $httpBackend.flush();
      });

      it('should reject promise when deleteProduct fails', function() {
        var productId = 'prod123';

        $httpBackend.expectDELETE(apiBase + '/' + productId)
          .respond(404, { message: 'Product not found' });

        ProductService.deleteProduct(productId).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });
    });
  });
})();