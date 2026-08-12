describe('CardService', function() {
  beforeEach(module('creditCardApp'));
  var CardService, $httpBackend, $q, $cacheFactory;

  beforeEach(inject(function(_CardService_, _$httpBackend_, _$q_, _$cacheFactory_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    var cache = $cacheFactory.get('cardCache');
    if (cache) {
      cache.removeAll();
    }
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should return empty array for empty cardIds
  - Purpose: Validates handling of empty input
  - Scenario: cardIds parameter is null or empty array
  - Expected Result: Returns resolved promise with empty array
  */
  it('should return empty array when cardIds is null', function() {
    CardService.getCardDetails(null).then(function(result) {
      expect(result).toEqual([]);
    });
  });

  it('should return empty array when cardIds is empty', function() {
    CardService.getCardDetails([]).then(function(result) {
      expect(result).toEqual([]);
    });
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should return all cached cards when available
  - Purpose: Validates cache retrieval functionality
  - Scenario: All requested cards exist in cache
  - Expected Result: Returns cached cards without API call
  */
  it('should return cached cards without API call', function() {
    var cache = $cacheFactory.get('cardCache');
    var mockCard1 = { cardId: '1', cardNumber: '1111' };
    var mockCard2 = { cardId: '2', cardNumber: '2222' };
    cache.put('card_1', mockCard1);
    cache.put('card_2', mockCard2);

    CardService.getCardDetails(['1', '2']).then(function(result) {
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('1');
      expect(result[1].cardId).toBe('2');
    });
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should fetch uncached cards from API
  - Purpose: Validates API call for missing cache entries
  - Scenario: Some cards are not in cache
  - Expected Result: API is called with uncached IDs, results are cached and returned
  */
  it('should fetch uncached cards from API and cache them', function() {
    var mockCards = [
      { cardId: '3', cardNumber: '3333' },
      { cardId: '4', cardNumber: '4444' }
    ];
    $httpBackend.expectGET('/api/cards?ids=3,4').respond(mockCards);

    CardService.getCardDetails(['3', '4']).then(function(result) {
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('3');
      expect(result[1].cardId).toBe('4');
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should combine cached and fetched cards
  - Purpose: Validates mixed cache and API scenario
  - Scenario: Some cards in cache, some need to be fetched
  - Expected Result: Returns combined results with cached first, then fetched
  */
  it('should combine cached and fetched cards', function() {
    var cache = $cacheFactory.get('cardCache');
    var cachedCard = { cardId: '1', cardNumber: '1111' };
    cache.put('card_1', cachedCard);

    var fetchedCards = [{ cardId: '2', cardNumber: '2222' }];
    $httpBackend.expectGET('/api/cards?ids=2').respond(fetchedCards);

    CardService.getCardDetails(['1', '2']).then(function(result) {
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('1');
      expect(result[1].cardId).toBe('2');
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should cache fetched cards for future use
  - Purpose: Validates cache persistence after API call
  - Scenario: Cards are fetched from API
  - Expected Result: Cards are stored in cache with correct key format
  */
  it('should cache fetched cards with correct key format', function() {
    var mockCards = [{ cardId: '5', cardNumber: '5555' }];
    $httpBackend.expectGET('/api/cards?ids=5').respond(mockCards);
    var cache = $cacheFactory.get('cardCache');

    CardService.getCardDetails(['5']).then(function() {
      var cachedCard = cache.get('card_5');
      expect(cachedCard).toBeDefined();
      expect(cachedCard.cardId).toBe('5');
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should handle API error gracefully
  - Purpose: Validates error handling and rejection
  - Scenario: API request fails with error status
  - Expected Result: Promise is rejected with error, console.error is called
  */
  it('should reject promise on API error', function() {
    spyOn(console, 'error');
    $httpBackend.expectGET('/api/cards?ids=6').respond(500, { error: 'Server error' });

    CardService.getCardDetails(['6']).catch(function(error) {
      expect(error.status).toBe(500);
      expect(console.error).toHaveBeenCalled();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should handle network timeout
  - Purpose: Validates timeout error handling
  - Scenario: API request times out
  - Expected Result: Promise is rejected
  */
  it('should handle network errors', function() {
    $httpBackend.expectGET('/api/cards?ids=7').respond(function() {
      return [0, null, {}];
    });

    CardService.getCardDetails(['7']).catch(function(error) {
      expect(error).toBeDefined();
    });

    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: getCardDetails - should handle multiple card IDs
  - Purpose: Validates batch processing of multiple cards
  - Scenario: Request contains multiple card IDs
  - Expected Result: All cards are processed and returned
  */
  it('should handle multiple card IDs in single request', function() {
    var mockCards = [
      { cardId: '8', cardNumber: '8888' },
      { cardId: '9', cardNumber: '9999' },
      { cardId: '10', cardNumber: '1010' }
    ];
    $httpBackend.expectGET('/api/cards?ids=8,9,10').respond(mockCards);

    CardService.getCardDetails(['8', '9', '10']).then(function(result) {
      expect(result.length).toBe(3);
    });

    $httpBackend.flush();
  });

  /*
  Coverage Report:
  - Functions tested: getCardDetails
  - Scenarios covered: empty input, all cached, all uncached, mixed cache/API, cache persistence, API errors, network errors, batch processing
  - Edge cases: null cardIds, empty array, single card, multiple cards, API failures
  - Uncovered scenarios: concurrent requests, cache expiration
  */
});
