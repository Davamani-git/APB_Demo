/*
Test Documentation:
- Test Name: productService - getProducts success
- Purpose: Validates retrieval of products with filters
- Scenario: Valid query parameters provided
- Expected Result: Promise resolves with products list
*/
/*
Test Documentation:
- Test Name: productService - getProductById success
- Purpose: Validates retrieval of single product
- Scenario: Valid productId provided
- Expected Result: Promise resolves with product details
*/
/*
Test Documentation:
- Test Name: productService - createProduct success
- Purpose: Validates product creation
- Scenario: Valid product data provided
- Expected Result: Promise resolves with created product
*/
/*
Test Documentation:
- Test Name: productService - updateProduct success
- Purpose: Validates product update
- Scenario: Valid productId and data provided
- Expected Result: Promise resolves with updated product
*/
/*
Test Documentation:
- Test Name: productService - deleteProduct success
- Purpose: Validates product deletion
- Scenario: Valid productId provided
- Expected Result: Promise resolves with success response
*/
/*
Coverage Report:
- Functions tested: getProducts, getProductById, createProduct, updateProduct, deleteProduct
- Scenarios covered: Full CRUD operations, error handling
- Uncovered scenarios: bulk operations, product variants
*/

(function() {
  'use strict';

  describe('productService', function() {
    var productService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_productService_, _$httpBackend_, _apiConfig_) {
      productService = _productService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getProducts', function() {
      it('should retrieve products with filters', function() {
        var params = { category: 'electronics', minPrice: 100 };
        var mockProducts = [
          { productId: 'P1', name: 'Laptop', price: 999 },
          { productId: 'P2', name: 'Phone', price: 599 }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/products?category=electronics&minPrice=100')
          .respond(200, mockProducts);

        var result;
        productService.getProducts(params).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockProducts);
        expect(result.length).toBe(2);
      });

      it('should reject promise on API error', function() {
        var params = { category: 'electronics' };

        $httpBackend.expectGET(apiConfig.baseUrl + '/products?category=electronics')
          .respond(500, { message: 'Server error' });

        var error;
        productService.getProducts(params).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });

    describe('getProductById', function() {
      it('should retrieve product by ID', function() {
        var productId = 'P123';
        var mockProduct = {
          productId: 'P123',
          name: 'Laptop',
          price: 999,
          description: 'High-performance laptop'
        };

        $httpBackend.expectGET(apiConfig.baseUrl + '/products/' + productId)
          .respond(200, mockProduct);

        var result;
        productService.getProductById(productId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockProduct);
        expect(result.productId).toBe('P123');
      });

      it('should reject promise when product not found', function() {
        var productId = 'P999';

        $httpBackend.expectGET(apiConfig.baseUrl + '/products/' + productId)
          .respond(404, { message: 'Product not found' });

        var error;
        productService.getProductById(productId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });

    describe('createProduct', function() {
      it('should create product successfully', function() {
        var productData = {
          name: 'New Product',
          price: 49.99,
          category: 'electronics'
        };
        var mockResponse = {
          productId: 'P456',
          name: 'New Product',
          price: 49.99
        };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/products', productData)
          .respond(201, mockResponse);

        var result;
        productService.createProduct(productData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.productId).toBe('P456');
      });

      it('should reject promise on creation error', function() {
        var productData = { name: 'New Product' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/products')
          .respond(400, { message: 'Invalid product data' });

        var error;
        productService.createProduct(productData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(400);
      });
    });

    describe('updateProduct', function() {
      it('should update product successfully', function() {
        var productId = 'P123';
        var productData = { name: 'Updated Product', price: 59.99 };
        var mockResponse = {
          productId: 'P123',
          name: 'Updated Product',
          price: 59.99
        };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/products/' + productId, productData)
          .respond(200, mockResponse);

        var result;
        productService.updateProduct(productId, productData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.name).toBe('Updated Product');
      });

      it('should reject promise on update error', function() {
        var productId = 'P123';
        var productData = { name: 'Updated Product' };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/products/' + productId)
          .respond(404, { message: 'Product not found' });

        var error;
        productService.updateProduct(productId, productData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });

    describe('deleteProduct', function() {
      it('should delete product successfully', function() {
        var productId = 'P123';
        var mockResponse = { success: true, message: 'Product deleted' };

        $httpBackend.expectDELETE(apiConfig.baseUrl + '/products/' + productId)
          .respond(200, mockResponse);

        var result;
        productService.deleteProduct(productId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(true);
      });

      it('should reject promise on deletion error', function() {
        var productId = 'P123';

        $httpBackend.expectDELETE(apiConfig.baseUrl + '/products/' + productId)
          .respond(404, { message: 'Product not found' });

        var error;
        productService.deleteProduct(productId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });
  });
})();