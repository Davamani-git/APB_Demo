/*
Test Documentation:
- Test Name: DashboardController - initializes with default values
- Purpose: Ensure the controller sets correct default state on load.
- Scenario: Controller is instantiated before async calls complete.
- Expected Result: vm.cards=[], vm.transactions=[], vm.loading=true, vm.error=null.

- Test Name: DashboardController - loads cards, transactions and computes KPIs on success
- Purpose: Validate that on successful data fetch, cards, transactions, and KPIs are populated.
- Scenario: CreditCardService and TransactionService both resolve successfully.
- Expected Result: vm.cards and vm.transactions are set, vm.kpis is populated, vm.loading=false.

- Test Name: DashboardController - sets error message on failure
- Purpose: Validate that when any service call fails, an error message is shown.
- Scenario: One or both services reject their promises.
- Expected Result: vm.error is set to the failure message, vm.loading=false.

Coverage Report:
- Functions tested: init (via controller instantiation)
- Scenarios covered: default state, successful data load, error handling
- Uncovered scenarios: partial failure of one of the two parallel calls
*/

describe('DashboardController', function() {
  'use strict';

  var $controller, $rootScope, $q, $scope;
  var CreditCardService, TransactionService, KPICalculator;
  var vm;

  var mockCards = [
    { cardHolderName: 'John Doe', cardNumber: '1234567890123456', creditLimit: 5000, availableCredit: 2000, outstandingAmount: 3000, currentBalance: 3000 }
  ];
  var mockTransactions = [
    { transactionDate: new Date().toISOString(), amount: 150 }
  ];
  var mockKPIs = {
    totalCreditLimit: 5000,
    totalAvailableCredit: 2000,
    totalOutstanding: 3000,
    monthlySpend: 150,
    cardCount: 1
  };

  beforeEach(module('dashboard'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $scope = $rootScope.$new();

    CreditCardService = {
      getCards: jasmine.createSpy('getCards').and.returnValue($q.resolve(mockCards))
    };
    TransactionService = {
      getTransactions: jasmine.createSpy('getTransactions').and.returnValue($q.resolve(mockTransactions))
    };
    KPICalculator = {
      computeKPIs: jasmine.createSpy('computeKPIs').and.returnValue(mockKPIs)
    };
  }));

  function createController() {
    vm = $controller('DashboardController', {
      $scope: $scope,
      $q: $q,
      CreditCardService: CreditCardService,
      TransactionService: TransactionService,
      KPICalculator: KPICalculator
    });
  }

  it('should initialize with default values before async resolution', function() {
    createController();
    expect(vm.cards).toEqual([]);
    expect(vm.transactions).toEqual([]);
    expect(vm.loading).toBe(true);
    expect(vm.error).toBeNull();
    expect(vm.kpis.totalCreditLimit).toBe(0);
    expect(vm.kpis.totalAvailableCredit).toBe(0);
    expect(vm.kpis.totalOutstanding).toBe(0);
    expect(vm.kpis.monthlySpend).toBe(0);
    expect(vm.kpis.cardCount).toBe(0);
  });

  it('should call CreditCardService.getCards and TransactionService.getTransactions on init', function() {
    createController();
    $rootScope.$digest();
    expect(CreditCardService.getCards).toHaveBeenCalled();
    expect(TransactionService.getTransactions).toHaveBeenCalled();
  });

  it('should populate vm.cards and vm.transactions on successful data load', function() {
    createController();
    $rootScope.$digest();
    expect(vm.cards).toEqual(mockCards);
    expect(vm.transactions).toEqual(mockTransactions);
  });

  it('should call KPICalculator.computeKPIs with cards and transactions on success', function() {
    createController();
    $rootScope.$digest();
    expect(KPICalculator.computeKPIs).toHaveBeenCalledWith(mockCards, mockTransactions);
  });

  it('should set vm.kpis with computed values on success', function() {
    createController();
    $rootScope.$digest();
    expect(vm.kpis).toEqual(mockKPIs);
  });

  it('should set vm.loading to false after successful data load', function() {
    createController();
    $rootScope.$digest();
    expect(vm.loading).toBe(false);
  });

  it('should set vm.error to null after successful data load', function() {
    createController();
    $rootScope.$digest();
    expect(vm.error).toBeNull();
  });

  it('should set vm.error message when CreditCardService rejects', function() {
    CreditCardService.getCards.and.returnValue($q.reject({ message: 'Network failure' }));
    spyOn(console, 'error');
    createController();
    $rootScope.$digest();
    expect(vm.error).toBe('Failed to load dashboard data. Please try again.');
    expect(vm.loading).toBe(false);
  });

  it('should set vm.error message when TransactionService rejects', function() {
    TransactionService.getTransactions.and.returnValue($q.reject({ message: 'Timeout' }));
    spyOn(console, 'error');
    createController();
    $rootScope.$digest();
    expect(vm.error).toBe('Failed to load dashboard data. Please try again.');
    expect(vm.loading).toBe(false);
  });

  it('should log error to console when initialization fails', function() {
    var mockError = { message: 'Service unavailable' };
    CreditCardService.getCards.and.returnValue($q.reject(mockError));
    spyOn(console, 'error');
    createController();
    $rootScope.$digest();
    expect(console.error).toHaveBeenCalledWith('Dashboard initialization error:', mockError);
  });

  it('should not call KPICalculator.computeKPIs when services fail', function() {
    CreditCardService.getCards.and.returnValue($q.reject({}));
    spyOn(console, 'error');
    createController();
    $rootScope.$digest();
    expect(KPICalculator.computeKPIs).not.toHaveBeenCalled();
  });

});