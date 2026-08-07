/*
Test Documentation:
- Test Name: LoggingService Usage
- Purpose: To verify that the LoggingService correctly calls the underlying $log service.
- Scenario: Calling info and error methods.
- Expected Result: The corresponding methods on the $log service are called with the correct arguments.
*/
/*
Coverage Report:
- Functions tested: info, error
- Scenarios covered: Logging informational messages, logging error messages.
- Uncovered scenarios: None.
*/
describe('LoggingService', function() {
    var LoggingService, $logMock;

    beforeEach(module('apbDemo.services'));

    beforeEach(function() {
        $logMock = {
            info: jasmine.createSpy('info'),
            error: jasmine.createSpy('error')
        };
        module(function($provide) {
            $provide.value('$log', $logMock);
        });
    });

    beforeEach(inject(function(_LoggingService_) {
        LoggingService = _LoggingService_;
    }));

    it('should call $log.info when info is called', function() {
        var message = 'Test info message';
        var context = { data: 'some_data' };
        LoggingService.info(message, context);
        expect($logMock.info).toHaveBeenCalledWith(message, context);
    });

    it('should call $log.error when error is called', function() {
        var message = 'Test error message';
        var context = { error: 'some_error' };
        LoggingService.error(message, context);
        expect($logMock.error).toHaveBeenCalledWith(message, context);
    });
});