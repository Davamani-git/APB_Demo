/*
Test Documentation:
- Test Name: ErrorHandlerService handleHttpError
- Purpose: To verify that the handleHttpError function correctly processes different HTTP error statuses.
- Scenario: Different HTTP error responses (500, 400, 401, 403, and unknown).
- Expected Result: A structured error model is returned for each status, and the LoggingService is called.
*/
/*
Coverage Report:
- Functions tested: handleHttpError
- Scenarios covered: Server error (5xx), bad request (400), auth errors (401, 403), and default/unknown errors.
- Uncovered scenarios: None.
*/
describe('ErrorHandlerService', function() {
    var ErrorHandlerService, LoggingServiceMock;

    beforeEach(module('apbDemo.services'));

    beforeEach(function() {
        LoggingServiceMock = {
            error: jasmine.createSpy('error')
        };
        module(function($provide) {
            $provide.value('LoggingService', LoggingServiceMock);
        });
    });

    beforeEach(inject(function(_ErrorHandlerService_) {
        ErrorHandlerService = _ErrorHandlerService_;
    }));

    it('should handle server errors (status 500)', function() {
        var response = { status: 500, data: 'Internal Server Error' };
        var errorModel = ErrorHandlerService.handleHttpError(response);
        expect(errorModel.code).toBe('SERVER_ERROR');
        expect(errorModel.message).toBe('A server error occurred. Please try again later.');
        expect(LoggingServiceMock.error).toHaveBeenCalledWith('A server error occurred. Please try again later.', { status: 500, data: 'Internal Server Error' });
    });

    it('should handle bad request errors (status 400)', function() {
        var response = { status: 400, data: 'Bad Request' };
        var errorModel = ErrorHandlerService.handleHttpError(response);
        expect(errorModel.code).toBe('BAD_REQUEST');
        expect(errorModel.message).toBe('Invalid request. Please check your inputs.');
        expect(LoggingServiceMock.error).toHaveBeenCalledWith('Invalid request. Please check your inputs.', { status: 400, data: 'Bad Request' });
    });

    it('should handle authorization errors (status 401)', function() {
        var response = { status: 401, data: 'Unauthorized' };
        var errorModel = ErrorHandlerService.handleHttpError(response);
        expect(errorModel.code).toBe('AUTH_ERROR');
        expect(errorModel.message).toBe('You are not authorized to perform this action.');
        expect(LoggingServiceMock.error).toHaveBeenCalledWith('You are not authorized to perform this action.', { status: 401, data: 'Unauthorized' });
    });

    it('should handle authorization errors (status 403)', function() {
        var response = { status: 403, data: 'Forbidden' };
        var errorModel = ErrorHandlerService.handleHttpError(response);
        expect(errorModel.code).toBe('AUTH_ERROR');
        expect(errorModel.message).toBe('You are not authorized to perform this action.');
        expect(LoggingServiceMock.error).toHaveBeenCalledWith('You are not authorized to perform this action.', { status: 403, data: 'Forbidden' });
    });

    it('should handle unknown errors', function() {
        var response = { status: 418, data: 'I am a teapot' };
        var errorModel = ErrorHandlerService.handleHttpError(response);
        expect(errorModel.code).toBe('UNKNOWN');
        expect(errorModel.message).toBe('An unexpected error occurred.');
        expect(LoggingServiceMock.error).toHaveBeenCalledWith('An unexpected error occurred.', { status: 418, data: 'I am a teapot' });
    });
});