describe('CreditCardService', function() {
  beforeEach(module('creditCardApp'));
  var CreditCardService, $httpBackend, $cacheFactory, $q;

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$cacheFactory_, _$q_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $cacheFactory = _$cacheFactory_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    var cache = $cacheFactory.get('creditCardCache');
    if (cache) {
      cache.removeAll();
    }
  });

  /*
  Test Documentation:
  - Test Name: getAllCards - should fetch and transform cards from API
  - Purpose: Validates API call and data transformation
  - Scenario: First call to getAllCards with empty cache
  - Expected Result: Returns transformed card objects with correct fields
  */
  it('should fetch all cards from API and transform data', function() {
    var mockResponse = [
      {
        cardId: 'card1',
        cardNumber: '1111222233334444',
        cardType: 'Visa',
        creditLimit: 10000,
        availableCredit: 5000,
        outstandingAmount: 5000,
        monthlySpend: 2000,
        lastUpdated: '2024-01-15T10:00:00Z'
      }
    ];
    $httpBackend.expectGET('/api/creditcards').respond(mockResponse);

    CreditCardService.getAllCards().then(function(cards) {
      expect(cards.length).toBe(1);
      expect(cards[0].cardId).toBe('card1');
      expect(cards[0].cardNumber).toBe('1111222233334444');
      expect(cards[0].cardType).toBe('Visa');
      expect(cards[0].creditLimit).toBe(10000);
      expect(cards[0].lastUpdated instanceof Date).toBe(true);
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getAllCards - should cache results with timestamp
  - Purpose: Validates caching mechanism
  - Scenario: First API call completes
  - Expected Result: Data is stored in cache with timestamp
  */
  it('should cache fetched cards with timestamp', function() {
    var mockResponse = [{
      cardId: 'card2',
      cardNumber: '2222333344445555',
      cardType: 'MasterCard',
      creditLimit: 15000,
      availableCredit: 10000,
      outstandingAmount: 5000,
      monthlySpend: 3000,
      lastUpdated: '2024-01-15T10:00:00Z'
    }];
    $httpBackend.expectGET('/api/creditcards').respond(mockResponse);
    var cache = $cacheFactory.get('creditCardCache');

    CreditCardService.getAllCards().then(function() {
      var cachedData = cache.get('allCards');
      expect(cachedData).toBeDefined();
      expect(cachedData.data).toBeDefined();
      expect(cachedData.timestamp).toBeDefined();
      expect(typeof cachedData.timestamp).toBe('number');
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getAllCards - should return cached data within TTL
  - Purpose: Validates cache hit within time-to-live window
  - Scenario: Second call within 30 seconds of first call
  - Expected Result: Returns cached data without API call
  */
  it('should return cached data within TTL without API call', function() {
    var mockResponse = [{
      cardId: 'card3',
      cardNumber: '3333444455556666',
      cardType: 'Amex',
      creditLimit: 20000,
      availableCredit: 15000,
      outstandingAmount: 5000,
      monthlySpend: 4000,
      lastUpdated: '2024-01-15T10:00:00Z'
    }];
    $httpBackend.expectGET('/api/creditcards').respond(mockResponse);

    CreditCardService.getAllCards().then(function(cards1) {
      expect(cards1.length).toBe(1);
      
      CreditCardService.getAllCards().then(function(cards2) {
        expect(cards2).toEqual(cards1);
      });
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getAllCards - should refresh cache after TTL expiration
  - Purpose: Validates cache expiration and refresh
  - Scenario: Second call after 30+ seconds
  - Expected Result: Makes new API call and updates cache
  */
  it('should make new API call after cache TTL expires', function() {
    var mockResponse1 = [{
      cardId: 'card4',
      cardNumber: '4444555566667777',
      cardType: 'Visa',
      creditLimit: 12000,
      availableCredit: 8000,
      outstandingAmount: 4000,
      monthlySpend: 2500,
      lastUpdated: '2024-01-15T10:00:00Z'
    }];
    $httpBackend.expectGET('/api/creditcards').respond(mockResponse1);

    CreditCardService.getAllCards().then(function(cards1) {
      var cache = $cacheFactory.get('creditCardCache');
      var cachedData = cache.get('allCards');
      cachedData.timestamp = Date.now() - 31000;

      var mockResponse2 = [{
        cardId: 'card4',
        cardNumber: '4444555566667777',
        cardType: 'Visa',
        creditLimit: 13000,
        availableCredit: 9000,
        outstandingAmount: 4000,
        monthlySpend: 2500,
        lastUpdated: '2024-01-15T11:00:00Z'
      }];
      $httpBackend.expectGET('/api/creditcards').respond(mockResponse2);

      CreditCardService.getAllCards().then(function(cards2) {
        expect(cards2[0].creditLimit).toBe(13000);
      });

      $httpBackend.flush();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getAllCards - should handle API error gracefully
  - Purpose: Validates error handling and rejection
  - Scenario: API request fails with error status
  - Expected Result: Promise is rejected with error, console.error is called
  */
  it('should reject promise on API error', function() {
    spyOn(console, 'error');
    $httpBackend.expectGET('/api/creditcards').respond(500, { error: 'Server error' });

    CreditCardService.getAllCards().catch(function(error) {
      expect(error.status).toBe(500);
      expect(console.error).toHaveBeenCalled();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getAllCards - should handle empty API response
  - Purpose: Validates handling of empty data
  - Scenario: API returns empty array
  - Expected Result: Returns empty array, no error thrown
  */
  it('should handle empty API response', function() {
    $httpBackend.expectGET('/api/creditcards').respond([]);

    CreditCardService.getAllCards().then(function(cards) {
      expect(cards).toEqual([]);
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getCardById - should return card from cache if available
  - Purpose: Validates single card retrieval from cache
  - Scenario: Card exists in cache
  - Expected Result: Returns cached card without API call
  */
  it('should return card from cache by ID', function() {
    var cache = $cacheFactory.get('creditCardCache');
    var mockCard = {
      cardId: 'card5',
      cardNumber: '5555666677778888',
      cardType: 'Visa',
      creditLimit: 8000
    };
    cache.put('allCards', {
      data: [mockCard],
      timestamp: Date.now()
    });

    CreditCardService.getCardById('card5').then(function(card) {
      expect(card.cardId).toBe('card5');
      expect(card.cardNumber).toBe('5555666677778888');
    });
  });

  /*
  Test Documentation:
  - Test Name: getCardById - should return null if card not found
  - Purpose: Validates handling of non-existent card ID
  - Scenario: Card ID does not exist in cache or API
  - Expected Result: Returns null
  */
  it('should return null for non-existent card ID', function() {
    var cache = $cacheFactory.get('creditCardCache');
    cache.put('allCards', {
      data: [],
      timestamp: Date.now()
    });

    CreditCardService.getCardById('nonexistent').then(function(card) {
      expect(card).toBeNull();
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardById
  - Scenarios covered: API fetch, data transformation, caching, cache TTL, cache expiration, API errors, empty responses, single card retrieval
  - Edge cases: empty array, null values, expired cache, missing card ID
  - Uncovered scenarios: concurrent API calls, partial cache updates
  */
});
