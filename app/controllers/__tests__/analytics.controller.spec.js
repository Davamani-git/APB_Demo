describe('AnalyticsController', function() {
    var $controller, AnalyticsService, LoggingService, ErrorHandlerService, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        AnalyticsService = jasmine.createSpyObj('AnalyticsService', ['getSpendingAnalytics']);
        LoggingService = jasmine.createSpyObj('LoggingService', ['info', 'error']);
        ErrorHandlerService = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

        $provide.value('AnalyticsService', AnalyticsService);
        $provide.value('LoggingService', LoggingService);
        $provide.value('ErrorHandlerService', ErrorHandlerService);
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_, $q) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;

        // Default mock resolve
        AnalyticsService.getSpendingAnalytics.and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve({ categoryWise: {}, monthlyTrend: {}, cardDistribution: {}, categoryBreakdown: {} });
            return deferred.promise;
        });
    }));

    function createController() {
        return $controller('AnalyticsController', {
            AnalyticsService: AnalyticsService,
            LoggingService: LoggingService,
            ErrorHandlerService: ErrorHandlerService
        });
    }

    it('should initialize with default params and call refreshAnalytics on activate', function() {
        // Arrange
        spyOn(AnalyticsService, 'getSpendingAnalytics').and.callThrough();

        // Act
        var vm = createController();
        $rootScope.$apply();

        // Assert
        expect(vm.params.cardIds).toEqual([]);
        expect(LoggingService.info).toHaveBeenCalledWith('AnalyticsController activated');
        expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalledWith(vm.params);
    });

    it('should set isLoading during refresh and populate analyticsData on success', function() {
        // Arrange
        var vm = createController();

        // Act
        vm.refreshAnalytics();
        expect(vm.isLoading).toBe(true);
        $rootScope.$apply();

        // Assert
        expect(vm.isLoading).toBe(false);
        expect(vm.error).toBeNull();
        expect(vm.analyticsData.categoryWise).toBeDefined();
        expect(LoggingService.info).toHaveBeenCalledWith('Analytics data loaded successfully');
    });

    it('should handle error from AnalyticsService and use ErrorHandlerService', function() {
        // Arrange
        inject(function($q) {
            AnalyticsService.getSpendingAnalytics.and.callFake(function() {
                var deferred = $q.defer();
                deferred.reject({ status: 500 });
                return deferred.promise;
            });
        });
        var vm = createController();
        var handledError = { message: 'Failed to load analytics data.' };
        ErrorHandlerService.handleError.and.returnValue(handledError);

        // Act
        vm.refreshAnalytics();
        $rootScope.$apply();

        // Assert
        expect(vm.error).toBe(handledError);
        expect(LoggingService.error).toHaveBeenCalled();
        expect(vm.isLoading).toBe(false);
    });

    it('should reset error before each refresh', function() {
        // Arrange
        var vm = createController();
        vm.error = { message: 'Old error' };

        // Act
        vm.refreshAnalytics();

        // Assert
        expect(vm.error).toBeNull();
    });
});

/*
Test Documentation:
- Test Name: Activation and default params
- Purpose: Verify controller initializes params and triggers initial analytics load.
- Scenario: Instantiate AnalyticsController with mocked dependencies.
- Expected Result: params.cardIds empty array, LoggingService.info called for activation, AnalyticsService.getSpendingAnalytics called with params.

- Test Name: Successful refreshAnalytics
- Purpose: Ensure loading state and analyticsData handled correctly on success.
- Scenario: refreshAnalytics invoked, AnalyticsService resolves with mock data.
- Expected Result: isLoading true during call, then false after promise; analyticsData populated; LoggingService.info called.

- Test Name: Error handling in refreshAnalytics
- Purpose: Confirm errors are processed via ErrorHandlerService and logged.
- Scenario: AnalyticsService.getSpendingAnalytics rejects; ErrorHandlerService.handleError returns model.
- Expected Result: vm.error set to handled error, LoggingService.error called, isLoading false.

- Test Name: Error reset before refresh
- Purpose: Ensure previous errors do not persist across refresh calls.
- Scenario: vm.error pre-set before refreshAnalytics.
- Expected Result: vm.error reset to null.
*/

/*
Coverage Report:
- Functions tested:
  - AnalyticsController constructor
  - activate()
  - refreshAnalytics()
- Statements covered:
  - Initialization of vm.params, vm.analyticsData, vm.isLoading, vm.error
  - LoggingService.info activation and success messages
  - Promise flow for AnalyticsService.getSpendingAnalytics (then/catch/finally)
- Branches covered:
  - Success path (then)
  - Error path (catch)
  - finally block always executed
- Error scenarios covered:
  - Service rejection leading to ErrorHandlerService.handleError and LoggingService.error
- Uncovered scenarios:
  - Edge cases with invalid params structure (not explicitly validated in controller).
*/