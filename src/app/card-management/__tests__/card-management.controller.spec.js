(function() {
  'use strict';

  describe('CardManagementController', function() {
    var vm, CardManagementService, $q, $rootScope, $scope;

    beforeEach(module('cardManagement'));

    beforeEach(inject(function($controller, _$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      CardManagementService = jasmine.createSpyObj('CardManagementService', ['getCards', 'getSelectedCard', 'setSelectedCard']);

      vm = $controller('CardManagementController', {
        CardManagementService: CardManagementService,
        $scope: $scope
      });
    }));

    /*
    Test Documentation:
    - Test Name: should initialize with default values
    - Purpose: Verify controller initialization
    - Scenario: Controller is instantiated
    - Expected Result: Default properties are set
    */
    it('should initialize with default values', function() {
      expect(vm.cards).toEqual([]);
      expect(vm.selectedCard).toBe(null);
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);
    });

    /*
    Test Documentation:
    - Test Name: should call loadCards on init
    - Purpose: Verify init triggers data loading
    - Scenario: init() is called
    - Expected Result: loadCards is invoked
    */
    it('should call loadCards on init', function() {
      spyOn(vm, 'loadCards');
      vm.init();
      expect(vm.loadCards).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: loadCards should fetch cards successfully
    - Purpose: Verify successful card loading
    - Scenario: CardManagementService returns cards
    - Expected Result: Cards are set, loading is false
    */
    it('loadCards should fetch cards successfully', function() {
      var mockCards = [
        { cardId: 1, cardType: 'Visa', cardNumber: '1234567890123456' },
        { cardId: 2, cardType: 'MasterCard', cardNumber: '9876543210987654' }
      ];
      var mockSelectedCard = mockCards[0];
      CardManagementService.getCards.and.returnValue($q.resolve(mockCards));
      CardManagementService.getSelectedCard.and.returnValue(mockSelectedCard);

      vm.loadCards();
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);

      $rootScope.$digest();

      expect(vm.cards).toEqual(mockCards);
      expect(vm.selectedCard).toEqual(mockSelectedCard);
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: loadCards should broadcast cardSelected event when card is selected
    - Purpose: Verify event broadcasting on successful load
    - Scenario: Cards are loaded and a card is already selected
    - Expected Result: cardSelected event is broadcast
    */
    it('loadCards should broadcast cardSelected event when card is selected', function() {
      var mockCards = [{ cardId: 1, cardType: 'Visa' }];
      var mockSelectedCard = mockCards[0];
      CardManagementService.getCards.and.returnValue($q.resolve(mockCards));
      CardManagementService.getSelectedCard.and.returnValue(mockSelectedCard);
      spyOn($scope, '$broadcast');

      vm.loadCards();
      $rootScope.$digest();

      expect($scope.$broadcast).toHaveBeenCalledWith('cardSelected', mockSelectedCard);
    });

    /*
    Test Documentation:
    - Test Name: loadCards should not broadcast when no card is selected
    - Purpose: Verify no event when selectedCard is null
    - Scenario: Cards are loaded but no card is selected
    - Expected Result: cardSelected event is not broadcast
    */
    it('loadCards should not broadcast when no card is selected', function() {
      var mockCards = [{ cardId: 1 }];
      CardManagementService.getCards.and.returnValue($q.resolve(mockCards));
      CardManagementService.getSelectedCard.and.returnValue(null);
      spyOn($scope, '$broadcast');

      vm.loadCards();
      $rootScope.$digest();

      expect($scope.$broadcast).not.toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: loadCards should handle errors
    - Purpose: Verify error handling during card loading
    - Scenario: CardManagementService rejects promise
    - Expected Result: Error message is set, loading is false
    */
    it('loadCards should handle errors', function() {
      CardManagementService.getCards.and.returnValue($q.reject('API Error'));

      vm.loadCards();
      $rootScope.$digest();

      expect(vm.error).toBe('Failed to load credit cards');
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: selectCard should set selected card and broadcast event
    - Purpose: Verify card selection functionality
    - Scenario: User selects a card
    - Expected Result: Card is set, service is updated, event is broadcast
    */
    it('selectCard should set selected card and broadcast event', function() {
      var card = { cardId: 1, cardType: 'Visa' };
      spyOn($scope, '$broadcast');

      vm.selectCard(card);

      expect(vm.selectedCard).toEqual(card);
      expect(CardManagementService.setSelectedCard).toHaveBeenCalledWith(card);
      expect($scope.$broadcast).toHaveBeenCalledWith('cardSelected', card);
    });

    /*
    Test Documentation:
    - Test Name: selectCard should handle null card
    - Purpose: Verify selection with null input
    - Scenario: selectCard is called with null
    - Expected Result: selectedCard is set to null, service is updated
    */
    it('selectCard should handle null card', function() {
      vm.selectCard(null);

      expect(vm.selectedCard).toBe(null);
      expect(CardManagementService.setSelectedCard).toHaveBeenCalledWith(null);
    });

    /*
    Test Documentation:
    - Test Name: maskCardNumber should mask card number correctly
    - Purpose: Verify card number masking
    - Scenario: Valid card number is provided
    - Expected Result: Only last 4 digits are shown
    */
    it('maskCardNumber should mask card number correctly', function() {
      var cardNumber = '1234567890123456';
      var result = vm.maskCardNumber(cardNumber);
      expect(result).toBe('**** **** **** 3456');
    });

    /*
    Test Documentation:
    - Test Name: maskCardNumber should handle null or undefined
    - Purpose: Verify masking with invalid input
    - Scenario: cardNumber is null or undefined
    - Expected Result: Empty string is returned
    */
    it('maskCardNumber should handle null or undefined', function() {
      expect(vm.maskCardNumber(null)).toBe('');
      expect(vm.maskCardNumber(undefined)).toBe('');
      expect(vm.maskCardNumber('')).toBe('');
    });

    /*
    Test Documentation:
    - Test Name: maskCardNumber should handle short card numbers
    - Purpose: Verify masking with less than 4 digits
    - Scenario: cardNumber has fewer than 4 characters
    - Expected Result: Masking pattern with available digits
    */
    it('maskCardNumber should handle short card numbers', function() {
      var result = vm.maskCardNumber('123');
      expect(result).toBe('**** **** **** 123');
    });

    /*
    Coverage Report:
    - Functions tested: init, loadCards, selectCard, maskCardNumber
    - Statements/branches covered: Initialization, successful card loading, error handling, card selection, event broadcasting, card number masking with various inputs
    - Error scenarios covered: API failure, null/undefined inputs, empty strings
    - Uncovered scenarios: None - all public methods and error paths tested
    */
  });
})();