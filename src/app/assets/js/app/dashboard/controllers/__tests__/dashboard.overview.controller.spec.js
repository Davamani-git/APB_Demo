describe('Controller: DashboardOverviewController', function() {
  var $controller, $rootScope, $scope, DashboardServiceMock, CardDataServiceMock, TransactionDataServiceMock, LoggingServiceMock, controller, $q;

  beforeEach(module('appmrn25.dashboard', function($provide) {
    DashboardServiceMock = jasmine.createSpyObj('DashboardService', ['getOverview', 'invalidateCache', 'toUserMessage']);
    CardDataServiceMock = jasmine.createSpyObj('CardDataService', ['computeUtilization']);
    TransactionDataServiceMock = jasmine.createSpyObj('TransactionDataService', ['buildMonthlySpendSeries']);
    LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['error']);

    $provide.value('DashboardService', DashboardServiceMock);
    $provide.value('CardDataService', CardDataServiceMock);
    $provide.value('TransactionDataService', TransactionDataServiceMock);
    $provide.value('LoggingService', LoggingServiceMock);
  }));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;
  }));

  function initControllerWithOverviewResponse(responsePromise) {
    DashboardServiceMock.getOverview.and.returnValue(responsePromise);
    controller = $controller('DashboardOverviewController as vm', {
      DashboardService: DashboardServiceMock,
      CardDataService: CardDataServiceMock,
      TransactionDataService: TransactionDataServiceMock,
      LoggingService: LoggingServiceMock,
      $scope: $scope
    });
  }

  it('should initialize and populate summary, cards, isStale on successful overview load', function() {
    // Arrange
    var deferred = $q.defer();
    var overviewData = {
      summary: { totalCreditLimit: 100 },
      cards: [{ cardId: '1' }, { cardId: '2' }],
      isStale: true
    };

    initControllerWithOverviewResponse(deferred.promise);

    // Act
    deferred.resolve(overviewData);
    $rootScope.$apply();

    // Assert
    expect(controller.loading).toBe(false);
    expect(controller.error).toBeNull();
    expect(controller.summary).toEqual(overviewData.summary);
    expect(controller.cards).toEqual(overviewData.cards);
    expect(controller.isStale).toBe(true);
    expect(controller.selectedCardId).toBe('1');
  });

  it('should keep existing selectedCardId when summary loads and selection already set', function() {
    // Arrange
    var deferred = $q.defer();
    var overviewData = {
      summary: {},
      cards: [{ cardId: '1' }, { cardId: '2' }],
      isStale: false
    };

    initControllerWithOverviewResponse(deferred.promise);
    controller.selectedCardId = '2';

    // Act
    deferred.resolve(overviewData);
    $rootScope.$apply();

    // Assert
    expect(controller.selectedCardId).toBe('2');
  });

  it('should handle overview load error and log error with user-friendly message', function() {
    // Arrange
    var deferred = $q.defer();
    var rawError = { code: 'AUTH_REQUIRED' };
    initControllerWithOverviewResponse(deferred.promise);
    DashboardServiceMock.toUserMessage.and.returnValue('Session expired');

    // Act
    deferred.reject(rawError);
    $rootScope.$apply();

    // Assert
    expect(controller.loading).toBe(false);
    expect(controller.error).toBe('Session expired');
    expect(LoggingServiceMock.error).toHaveBeenCalledWith('DashboardOverview', rawError);
  });

  it('should always clear loading flag in finally block', function() {
    // Arrange
    var deferred = $q.defer();
    initControllerWithOverviewResponse(deferred.promise);

    // Act
    deferred.reject({});
    $rootScope.$apply();

    // Assert
    expect(controller.loading).toBe(false);
  });

  it('should refresh by invalidating cache and re-invoking init', function() {
    // Arrange
    var deferred = $q.defer();
    initControllerWithOverviewResponse(deferred.promise);

    spyOn(controller, 'init').and.callThrough();

    // Act
    controller.refresh();

    // Assert
    expect(DashboardServiceMock.invalidateCache).toHaveBeenCalled();
    expect(controller.init).toHaveBeenCalled();
  });

  it('should update selected card id on selectCard', function() {
    // Arrange
    initControllerWithOverviewResponse($q.when({ summary: {}, cards: [], isStale: false }));

    // Act
    controller.selectCard('123');

    // Assert
    expect(controller.selectedCardId).toBe('123');
  });

  it('should delegate getUtilization to CardDataService', function() {
    // Arrange
    initControllerWithOverviewResponse($q.when({ summary: {}, cards: [], isStale: false }));
    var card = { cardId: '1' };
    CardDataServiceMock.computeUtilization.and.returnValue(0.5);

    // Act
    var utilization = controller.getUtilization(card);

    // Assert
    expect(CardDataServiceMock.computeUtilization).toHaveBeenCalledWith(card);
    expect(utilization).toBe(0.5);
  });

  it('should clear summary and cards when auth:logout event is broadcast', function() {
    // Arrange
    initControllerWithOverviewResponse($q.when({ summary: { foo: 'bar' }, cards: [{ cardId: '1' }], isStale: false }));
    $rootScope.$apply();

    // Pre-assert
    expect(controller.summary).not.toBeNull();
    expect(controller.cards.length).toBeGreaterThan(0);

    // Act
    $scope.$broadcast('auth:logout');
    $rootScope.$apply();

    // Assert
    expect(controller.summary).toBeNull();
    expect(controller.cards.length).toBe(0);
  });
});

/*
Test Documentation:
- Test Name: DashboardOverviewController behavior
- Purpose: Validate initialization, refresh, selection, utilization, and auth event handling.
- Scenario: Simulate successful and failing DashboardService.getOverview calls, refresh invocations, selectCard usage, getUtilization delegation, and auth:logout broadcast.
- Expected Result: Controller sets loading state, populates summary/cards/isStale, handles errors via toUserMessage and LoggingService, invalidates cache on refresh, updates selections, delegates utilization, and clears data on auth:logout.
*/

/*
Coverage Report:
- Functions tested: init, refresh, selectCard, getUtilization, auth:logout listener.
- Statements covered: Initialization of vm properties, getOverview success and error handlers, finally block, invalidateCache call, selectCard assignment, CardDataService delegation, auth:logout handler.
- Branches covered: Successful vs failing getOverview; presence vs absence of existing selectedCardId; presence vs absence of cards; auth:logout event path.
- Error scenarios covered: getOverview rejection, conversion of error via toUserMessage, logging of errors, ensuring loading flag cleared on errors.
- Uncovered scenarios: Interaction with TransactionDataService (not used directly in controller logic), rare edge cases like undefined response fields.
*/