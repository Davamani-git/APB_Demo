describe('LoggingService', function() {
    var LoggingService, $log;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $log = jasmine.createSpyObj('$log', ['info', 'warn', 'error']);
        $provide.value('$log', $log);
    }));

    beforeEach(inject(function(_LoggingService_) {
        LoggingService = _LoggingService_;
    }));

    it('should call $log.info with message and context', function() {
        // Arrange
        var ctx = { a: 1 };

        // Act
        LoggingService.info('msg', ctx);

        // Assert
        expect($log.info).toHaveBeenCalledWith('msg', ctx);
    });

    it('should call $log.warn with message and context', function() {
        // Arrange
        var ctx = { a: 2 };

        // Act
        LoggingService.warn('warn', ctx);

        // Assert
        expect($log.warn).toHaveBeenCalledWith('warn', ctx);
    });

    it('should call $log.error with message and context', function() {
        // Arrange
        var ctx = { a: 3 };

        // Act
        LoggingService.error('err', ctx);

        // Assert
        expect($log.error).toHaveBeenCalledWith('err', ctx);
    });

    it('should default context to empty string when not provided', function() {
        // Act
        LoggingService.info('noctx');
        LoggingService.warn('noctx');
        LoggingService.error('noctx');

        // Assert
        expect($log.info).toHaveBeenCalledWith('noctx', '');
        expect($log.warn).toHaveBeenCalledWith('noctx', '');
        expect($log.error).toHaveBeenCalledWith('noctx', '');
    });
});

/*
Test Documentation:
- Test Name: info logging with context
- Purpose: Verify LoggingService.info delegates to $log.info with message and context.
- Scenario: Call info('msg', {a:1}).
- Expected Result: $log.info('msg', {a:1}) called.

- Test Name: warn logging with context
- Purpose: Verify LoggingService.warn delegates correctly.
- Scenario: Call warn('warn', {a:2}).
- Expected Result: $log.warn('warn', {a:2}) called.

- Test Name: error logging with context
- Purpose: Verify LoggingService.error delegates correctly.
- Scenario: Call error('err', {a:3}).
- Expected Result: $log.error('err', {a:3}) called.

- Test Name: default context handling
- Purpose: Ensure missing context defaults to empty string.
- Scenario: Call info/warn/error with only message.
- Expected Result: $log methods called with message and '' as context.
*/

/*
Coverage Report:
- Functions tested:
  - LoggingService.info()
  - LoggingService.warn()
  - LoggingService.error()
- Statements covered:
  - All three methods and default context logic
- Branches covered:
  - context provided vs not provided
- Error scenarios covered:
  - None (simple logging wrapper)
- Uncovered scenarios:
  - None; service behavior fully covered.
*/