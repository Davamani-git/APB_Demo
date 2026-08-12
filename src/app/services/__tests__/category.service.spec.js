describe('CategoryService', function() {
  beforeEach(module('creditCardApp'));
  var CategoryService;

  beforeEach(inject(function(_CategoryService_) {
    CategoryService = _CategoryService_;
  }));

  /*
  Test Documentation:
  - Test Name: getCategoryList - should return all categories
  - Purpose: Validates category list retrieval
  - Scenario: Request for complete category list
  - Expected Result: Returns array with all 9 predefined categories
  */
  it('should return all predefined categories', function() {
    CategoryService.getCategoryList().then(function(categories) {
      expect(categories.length).toBe(9);
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify food merchant
  - Purpose: Validates keyword matching for Food & Dining category
  - Scenario: Merchant name contains food-related keyword
  - Expected Result: Returns 'Food & Dining'
  */
  it('should classify restaurant transaction as Food & Dining', function() {
    var category = CategoryService.classifyTransaction('Pizza Hut', 'Dinner');
    expect(category).toBe('Food & Dining');
  });

  it('should classify cafe transaction as Food & Dining', function() {
    var category = CategoryService.classifyTransaction('Starbucks Cafe', 'Coffee');
    expect(category).toBe('Food & Dining');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify fuel merchant
  - Purpose: Validates keyword matching for Fuel category
  - Scenario: Merchant name contains fuel-related keyword
  - Expected Result: Returns 'Fuel'
  */
  it('should classify gas station transaction as Fuel', function() {
    var category = CategoryService.classifyTransaction('Shell Gas Station', 'Fuel');
    expect(category).toBe('Fuel');
  });

  it('should classify petrol pump as Fuel', function() {
    var category = CategoryService.classifyTransaction('BP Petrol', 'Refuel');
    expect(category).toBe('Fuel');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify shopping merchant
  - Purpose: Validates keyword matching for Shopping category
  - Scenario: Merchant name contains shopping-related keyword
  - Expected Result: Returns 'Shopping'
  */
  it('should classify retail store transaction as Shopping', function() {
    var category = CategoryService.classifyTransaction('Walmart Store', 'Groceries');
    expect(category).toBe('Shopping');
  });

  it('should classify mall transaction as Shopping', function() {
    var category = CategoryService.classifyTransaction('City Mall', 'Clothing');
    expect(category).toBe('Shopping');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify travel merchant
  - Purpose: Validates keyword matching for Travel category
  - Scenario: Merchant name contains travel-related keyword
  - Expected Result: Returns 'Travel'
  */
  it('should classify airline transaction as Travel', function() {
    var category = CategoryService.classifyTransaction('American Airlines', 'Flight');
    expect(category).toBe('Travel');
  });

  it('should classify hotel transaction as Travel', function() {
    var category = CategoryService.classifyTransaction('Marriott Hotel', 'Accommodation');
    expect(category).toBe('Travel');
  });

  it('should classify taxi transaction as Travel', function() {
    var category = CategoryService.classifyTransaction('Uber Taxi', 'Ride');
    expect(category).toBe('Travel');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify entertainment merchant
  - Purpose: Validates keyword matching for Entertainment category
  - Scenario: Merchant name contains entertainment-related keyword
  - Expected Result: Returns 'Entertainment'
  */
  it('should classify movie theater transaction as Entertainment', function() {
    var category = CategoryService.classifyTransaction('AMC Cinema', 'Movie Ticket');
    expect(category).toBe('Entertainment');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify utilities merchant
  - Purpose: Validates keyword matching for Utilities category
  - Scenario: Merchant name contains utility-related keyword
  - Expected Result: Returns 'Utilities'
  */
  it('should classify electric bill as Utilities', function() {
    var category = CategoryService.classifyTransaction('Electric Company', 'Monthly Bill');
    expect(category).toBe('Utilities');
  });

  it('should classify water bill as Utilities', function() {
    var category = CategoryService.classifyTransaction('Water Department', 'Water Bill');
    expect(category).toBe('Utilities');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify healthcare merchant
  - Purpose: Validates keyword matching for Healthcare category
  - Scenario: Merchant name contains healthcare-related keyword
  - Expected Result: Returns 'Healthcare'
  */
  it('should classify hospital transaction as Healthcare', function() {
    var category = CategoryService.classifyTransaction('City Hospital', 'Medical');
    expect(category).toBe('Healthcare');
  });

  it('should classify pharmacy transaction as Healthcare', function() {
    var category = CategoryService.classifyTransaction('CVS Pharmacy', 'Prescription');
    expect(category).toBe('Healthcare');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should classify education merchant
  - Purpose: Validates keyword matching for Education category
  - Scenario: Merchant name contains education-related keyword
  - Expected Result: Returns 'Education'
  */
  it('should classify university transaction as Education', function() {
    var category = CategoryService.classifyTransaction('MIT University', 'Tuition');
    expect(category).toBe('Education');
  });

  it('should classify course transaction as Education', function() {
    var category = CategoryService.classifyTransaction('Coursera', 'Online Course');
    expect(category).toBe('Education');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should return Miscellaneous for unmatched keywords
  - Purpose: Validates default category for unknown merchants
  - Scenario: Merchant and description contain no recognized keywords
  - Expected Result: Returns 'Miscellaneous'
  */
  it('should return Miscellaneous for unknown merchant', function() {
    var category = CategoryService.classifyTransaction('Unknown Vendor', 'Random Purchase');
    expect(category).toBe('Miscellaneous');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should be case-insensitive
  - Purpose: Validates case-insensitive keyword matching
  - Scenario: Merchant name in uppercase
  - Expected Result: Still matches and returns correct category
  */
  it('should classify transaction case-insensitively', function() {
    var category = CategoryService.classifyTransaction('PIZZA HUT RESTAURANT', 'DINNER');
    expect(category).toBe('Food & Dining');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should handle empty merchant and description
  - Purpose: Validates handling of empty input
  - Scenario: Merchant or description is empty string
  - Expected Result: Returns 'Miscellaneous'
  */
  it('should return Miscellaneous for empty merchant', function() {
    var category = CategoryService.classifyTransaction('', 'Some Description');
    expect(category).toBe('Miscellaneous');
  });

  it('should return Miscellaneous for empty description', function() {
    var category = CategoryService.classifyTransaction('Some Merchant', '');
    expect(category).toBe('Miscellaneous');
  });

  /*
  Test Documentation:
  - Test Name: classifyTransaction - should match first matching category
  - Purpose: Validates that first matching category is returned
  - Scenario: Merchant contains keywords from multiple categories
  - Expected Result: Returns first matching category in keyword list
  */
  it('should return first matching category when multiple keywords present', function() {
    var category = CategoryService.classifyTransaction('Restaurant Shop', 'Food and Retail');
    expect(category).toBe('Food & Dining');
  });

  /*
  Coverage Report:
  - Functions tested: getCategoryList, classifyTransaction
  - Scenarios covered: all 9 categories, keyword matching, case-insensitivity, empty input, multiple keywords, unknown merchants
  - Edge cases: empty strings, mixed case, overlapping keywords
  - Uncovered scenarios: special characters in merchant names, null values
  */
});
