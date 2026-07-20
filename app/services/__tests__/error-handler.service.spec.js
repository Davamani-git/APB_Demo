describe('ErrorHandlerService', function() {
    var ErrorHandlerService, LoggingService;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        LoggingService = jasmine.createSpyObj('LoggingService', ['error']);
        $provide.value('LoggingService', LoggingService);
    }));

    beforeEach(inject(function(_ErrorHandlerService_) {
        ErrorHandlerService = _ErrorHandlerService_;
    }));

    it('should return default error model when httpError is null', function() {
        // Arrange & Act
        var model = ErrorHandlerService.handleError(null, null);

        // Assert
        expect(model.code).toBe('UNKNOWN_ERROR');
        expect(model.message).toContain('unexpected error');
        expect(LoggingService.error).toHaveBeenCalled();
    });

    it('should include httpError.data as details when present', function() {
        // Arrange
        var httpError = { data: { field: 'value' } };

        // Act
        var model = ErrorHandlerService.handleError(httpError, 'Custom message');

        // Assert
        expect(model.details).toContain('field');
        expect(model.message).toBe('Custom message');
    });

    it('should map status codes to specific error codes', function() {
        // Arrange & Act
        var error400 = ErrorHandlerService.handleError({ status: 400 }, '');
        var error401 = ErrorHandlerService.handleError({ status: 401 }, '');
        var error403 = ErrorHandlerService.handleError({ status: 403 }, '');
        var error404 = ErrorHandlerService.handleError({ status: 404 }, '');
        var error429 = ErrorHandlerService.handleError({ status: 429 }, '');
        var error500 = ErrorHandlerService.handleError({ status: 500 }, '');
        var error503 = ErrorHandlerService.handleError({ status: 503 }, '');

        // Assert
        expect(error400.code).toBe('VALIDATION_ERROR');
        expect(error401.code).toBe('AUTH_ERROR');
        expect(error403.code).toBe('AUTH_ERROR');
        expect(error404.code).toBe('NOT_FOUND');
        expect(error429.code).toBe('RATE_LIMIT');
        expect(error500.code).toBe('SERVER_ERROR');
        expect(error503.code).toBe('SERVER_ERROR');
    });
});

/*
Test Documentation:
- Test Name: default error model
- Purpose: Verify handleError returns default error model when httpError is null and logs error.
- Scenario: Call handleError(null, null).
- Expected Result: code 'UNKNOWN_ERROR', default message, LoggingService.error called.

- Test Name: error details from httpError.data
- Purpose: Ensure httpError.data is serialized into details and custom message used.
- Scenario: httpError.data is object; userMessage 'Custom message'.
- Expected Result: details contains serialized data; message equals 'Custom message'.

- Test Name: status code mapping
- Purpose: Validate mapping from HTTP status to custom codes.
- Scenario: Call handleError with status 400, 401, 403, 404, 429, 500, 503.
- Expected Result: codes VALIDATION_ERROR, AUTH_ERROR, AUTH_ERROR, NOT_FOUND, RATE_LIMIT, SERVER_ERROR, SERVER_ERROR respectively.
*/

/*
Coverage Report:
- Functions tested:
  - ErrorHandlerService.handleError()
- Statements covered:
  - Default model initialization
  - httpError.data processing and serialization
  - switch mapping for status codes
  - LoggingService.error invocation
- Branches covered:
  - Presence vs absence of httpError
  - Presence vs absence of httpError.data
  - Different status code branches within switch
- Error scenarios covered:
  - Various HTTP error codes mapped to domain-specific codes
- Uncovered scenarios:
  - Handling unexpected status codes outside defined cases.
*/