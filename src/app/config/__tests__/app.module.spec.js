describe('app module run block', function() {
    var $rootScope;
    var LoggingService;

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _LoggingService_) {
        $rootScope = _$rootScope_;
        LoggingService = _LoggingService_;
        spyOn(LoggingService, 'info');
    }));

    it('should log route change success with originalPath when current route is provided', function() {
        // Arrange
        var currentRoute = { originalPath: '/test-path' };

        // Act
        $rootScope.$broadcast('$routeChangeSuccess', {}, currentRoute);

        // Assert
        expect(LoggingService.info).toHaveBeenCalledWith('Route changed', { route: '/test-path' });
    });

    it('should log route change success with undefined route when current route is missing', function() {
        // Arrange

        // Act
        $rootScope.$broadcast('$routeChangeSuccess', {}, null);

        // Assert
        expect(LoggingService.info).toHaveBeenCalledWith('Route changed', { route: undefined });
    });

    it('should not throw when LoggingService.info fails internally', function() {
        // Arrange
        LoggingService.info.and.throwError('logging failure');

        // Act / Assert
        expect(function() {
            $rootScope.$broadcast('$routeChangeSuccess', {}, { originalPath: '/error' });
        }).not.toThrow();
    });
});

/*
Test Documentation:
- Test Name: Route change logging with valid route
- Purpose: Verify that app run block logs route changes with the correct originalPath.
- Scenario: $routeChangeSuccess broadcast with a current route containing originalPath.
- Expected Result: LoggingService.info is called with message 'Route changed' and route equal to originalPath.

- Test Name: Route change logging with missing route
- Purpose: Verify behavior when current route is not provided.
- Scenario: $routeChangeSuccess broadcast with null current route.
- Expected Result: LoggingService.info is called with route set to undefined.

- Test Name: Route change logging resilience to LoggingService errors
- Purpose: Ensure that exceptions thrown by LoggingService.info do not break route change handling.
- Scenario: Spy on LoggingService.info to throw, then broadcast $routeChangeSuccess.
- Expected Result: No exception propagates from the broadcast.
*/

/*
Coverage Report:
- Functions tested:
  - appRun (implicit via module run block)
- Statements covered:
  - Subscription to $routeChangeSuccess
  - LoggingService.info invocation
  - Access of current.originalPath when current is provided
  - Handling of null current route
- Branches covered:
  - current route provided vs. null
- Error scenarios covered:
  - LoggingService.info throwing an error
- Uncovered scenarios:
  - Other $rootScope events
  - LoggingService methods warn, error, audit (covered in logging.service.spec.js)
*/