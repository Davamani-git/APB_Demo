describe('app module run block', function() {
    var $rootScope, $location, LoggingService;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        LoggingService = jasmine.createSpyObj('LoggingService', ['info', 'error']);
        $provide.value('LoggingService', LoggingService);
    }));

    beforeEach(inject(function(_$rootScope_, _$location_) {
        $rootScope = _$rootScope_;
        $location = _$location_;
    }));

    it('should initialize isLoading to false on run', function() {
        // Arrange & Act
        // run block executes on module load via beforeEach(module('app'))

        // Assert
        expect($rootScope.isLoading).toBe(false);
    });

    it('should set isLoading true and log on routeChangeStart', function() {
        // Arrange
        var next = { originalPath: '/test' };

        // Act
        $rootScope.$broadcast('$routeChangeStart', {}, next, {});

        // Assert
        expect($rootScope.isLoading).toBe(true);
        expect(LoggingService.info).toHaveBeenCalledWith('Route change started', { to: next.originalPath });
    });

    it('should set isLoading false, update pageTitle and log on routeChangeSuccess', function() {
        // Arrange
        var current = { title: 'My Page' };

        // Act
        $rootScope.$broadcast('$routeChangeSuccess', current, {});

        // Assert
        expect($rootScope.isLoading).toBe(false);
        expect($rootScope.pageTitle).toBe('My Page');
        expect(LoggingService.info).toHaveBeenCalledWith('Route change successful', { path: $location.path() });
    });

    it('should default pageTitle to Dashboard when title is missing', function() {
        // Arrange
        var current = {};

        // Act
        $rootScope.$broadcast('$routeChangeSuccess', current, {});

        // Assert
        expect($rootScope.pageTitle).toBe('Dashboard');
    });

    it('should handle routeChangeError by setting isLoading false, logging error and redirecting', function() {
        // Arrange
        spyOn($location, 'path');
        var rejection = { message: 'error' };

        // Act
        $rootScope.$broadcast('$routeChangeError', {}, {}, rejection);

        // Assert
        expect($rootScope.isLoading).toBe(false);
        expect(LoggingService.error).toHaveBeenCalledWith('Route change error', { rejection: rejection });
        expect($location.path).toHaveBeenCalledWith('/dashboard');
    });
});

/*
Test Documentation:
- Test Name: Initialize isLoading
- Purpose: Verify that isLoading is initialized to false in the run block.
- Scenario: Module 'app' is loaded.
- Expected Result: $rootScope.isLoading equals false.

- Test Name: Route change start behavior
- Purpose: Ensure isLoading is set to true and info log is emitted.
- Scenario: $routeChangeStart is broadcast with a next route.
- Expected Result: isLoading true, LoggingService.info called with proper context.

- Test Name: Route change success behavior with title
- Purpose: Confirm isLoading is false, pageTitle is set from route, and info log is emitted.
- Scenario: $routeChangeSuccess is broadcast with current.title.
- Expected Result: isLoading false, pageTitle equals route title, LoggingService.info called.

- Test Name: Route change success behavior without title
- Purpose: Confirm pageTitle defaults to 'Dashboard' when route lacks title.
- Scenario: $routeChangeSuccess is broadcast with empty current object.
- Expected Result: pageTitle 'Dashboard'.

- Test Name: Route change error behavior
- Purpose: Ensure errors reset loading state, log error, and redirect to /dashboard.
- Scenario: $routeChangeError is broadcast with rejection.
- Expected Result: isLoading false, LoggingService.error called, $location.path('/dashboard') invoked.
*/

/*
Coverage Report:
- Functions tested:
  - Anonymous run block in app.module.js
- Statements covered:
  - Initialization of $rootScope.isLoading
  - $rootScope.$on handlers for $routeChangeStart, $routeChangeSuccess, $routeChangeError
  - LoggingService.info and LoggingService.error calls
  - $location.path('/dashboard') redirect
- Branches covered:
  - $routeChangeSuccess with title defined and title undefined
- Error scenarios covered:
  - Route change error handler path
- Uncovered scenarios:
  - None significant; internal logic is fully covered.
*/