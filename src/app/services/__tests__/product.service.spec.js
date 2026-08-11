/*
Test Documentation:
- Test Name: ProductService getProducts without filters
- Purpose: Validates retrieval of all products
- Scenario: No filters provided
- Expected Result: All mock products are returned
*/
/*
Test Documentation:
- Test Name: ProductService getProducts with keyword filter
- Purpose: Validates product search by keyword
- Scenario: Keyword matches product name or description
- Expected Result: Only matching products are returned
*/
/*
Test Documentation:
- Test Name: ProductService getProducts with category filter
- Purpose: Validates filtering by category
- Scenario: Category filter provided
- Expected Result: Only products in category are returned
*/
/*
Test Documentation:
- Test Name: ProductService getProducts with sorting
- Purpose: Validates product sorting
- Scenario: Sort by price ascending, descending, or rating
- Expected Result: Products are sorted correctly
*/
/*
Test Documentation:
- Test Name: ProductService getProductById success
- Purpose: Validates retrieval of specific product
- Scenario: Product ID exists
- Expected Result: Product is returned
*/
/*
Test Documentation:
- Test Name: ProductService getProductById not found
- Purpose: Validates error when product doesn't exist
- Scenario: Product ID doesn't exist
- Expected Result: Promise is rejected
*/
/*
Coverage Report:
- Functions tested: getProducts, getProductById
- Scenarios covered: get all products, keyword search, category filter, sorting (price-asc, price-desc, rating), get by ID success, get by ID failure
- Uncovered scenarios: none
*/

describe('ProductService', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var ProductService, $timeout;
  
  beforeEach(inject(function(_ProductService_, _$timeout_) {
    ProductService = _ProductService_;
    $timeout = _$timeout_;
  }));
  
  describe('getProducts', function() {
    it('should return all products without filters', function(done) {
      ProductService.getProducts().then(function(products) {
        expect(products.length).toBe(6);
        expect(products[0].productId).toBe('p1');
        expect(products[0].name).toBe('Laptop');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should filter products by keyword in name', function(done) {
      ProductService.getProducts({ keyword: 'phone' }).then(function(products) {
        expect(products.length).toBe(2);
        expect(products[0].name).toBe('Smartphone');
        expect(products[1].name).toBe('Headphones');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should filter products by keyword in description', function(done) {
      ProductService.getProducts({ keyword: 'portable' }).then(function(products) {
        expect(products.length).toBe(1);
        expect(products[0].name).toBe('Tablet');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should filter products by category', function(done) {
      ProductService.getProducts({ category: 'Electronics' }).then(function(products) {
        expect(products.length).toBe(5);
        products.forEach(function(p) {
          expect(p.category).toBe('Electronics');
        });
        done();
      });
      
      $timeout.flush();
    });
    
    it('should filter products by Accessories category', function(done) {
      ProductService.getProducts({ category: 'Accessories' }).then(function(products) {
        expect(products.length).toBe(1);
        expect(products[0].name).toBe('Watch');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should sort products by price ascending', function(done) {
      ProductService.getProducts({ sortBy: 'price-asc' }).then(function(products) {
        expect(products[0].price).toBe(199);
        expect(products[products.length - 1].price).toBe(999);
        for (var i = 0; i < products.length - 1; i++) {
          expect(products[i].price).toBeLessThanOrEqual(products[i + 1].price);
        }
        done();
      });
      
      $timeout.flush();
    });
    
    it('should sort products by price descending', function(done) {
      ProductService.getProducts({ sortBy: 'price-desc' }).then(function(products) {
        expect(products[0].price).toBe(999);
        expect(products[products.length - 1].price).toBe(199);
        for (var i = 0; i < products.length - 1; i++) {
          expect(products[i].price).toBeGreaterThanOrEqual(products[i + 1].price);
        }
        done();
      });
      
      $timeout.flush();
    });
    
    it('should sort products by rating', function(done) {
      ProductService.getProducts({ sortBy: 'rating' }).then(function(products) {
        expect(products[0].ratings).toBe(4.7);
        for (var i = 0; i < products.length - 1; i++) {
          expect(products[i].ratings).toBeGreaterThanOrEqual(products[i + 1].ratings);
        }
        done();
      });
      
      $timeout.flush();
    });
    
    it('should combine keyword and category filters', function(done) {
      ProductService.getProducts({ keyword: 'camera', category: 'Electronics' }).then(function(products) {
        expect(products.length).toBe(1);
        expect(products[0].name).toBe('Camera');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should return empty array when no products match', function(done) {
      ProductService.getProducts({ keyword: 'nonexistent' }).then(function(products) {
        expect(products.length).toBe(0);
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getProductById', function() {
    it('should return product when found', function(done) {
      ProductService.getProductById('p1').then(function(product) {
        expect(product.productId).toBe('p1');
        expect(product.name).toBe('Laptop');
        expect(product.price).toBe(999);
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject when product not found', function(done) {
      ProductService.getProductById('p-nonexistent').catch(function(error) {
        expect(error).toBe('Product not found');
        done();
      });
      
      $timeout.flush();
    });
  });
});